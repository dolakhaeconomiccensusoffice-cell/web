 const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const DRIVE_FOLDER_ID = process.env.DRIVE_FOLDER_ID;

const client_id = process.env.GOOGLE_CLIENT_ID;
const client_secret = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const TOKEN_FILE = 'token.json';

console.log('========================================');
console.log('🚀 STARTING GOOGLE DRIVE UPLOAD SERVER');
console.log('========================================\n');

async function getNewToken() {
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent'
  });

  console.log('\n🔐 FIRST TIME SETUP - Authorize this app:\n');
  console.log(authUrl);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  return new Promise((resolve, reject) => {
    rl.question('📝 Enter the code from that page: ', (code) => {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) reject(err);
        else {
          fs.writeFileSync(TOKEN_FILE, JSON.stringify(token, null, 2));
          console.log('\n✅ Token saved!\n');
          resolve(token);
        }
      });
    });
  });
}

async function getAuthenticatedClient() {
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);
  
  if (fs.existsSync(TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oauth2Client.setCredentials(token);
    
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log('🔄 Token expired, refreshing...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials, null, 2));
        console.log('✅ Token refreshed!');
      } catch (err) {
        console.log('❌ Cannot refresh, getting new token...');
        const newToken = await getNewToken();
        oauth2Client.setCredentials(newToken);
      }
    } else {
      console.log('✅ Token loaded from file');
    }
  } else {
    console.log('⚠️ No token found. First time setup...');
    const newToken = await getNewToken();
    oauth2Client.setCredentials(newToken);
  }
  
  return oauth2Client;
}

let drive;

async function init() {
  try {
    const auth = await getAuthenticatedClient();
    drive = google.drive({ version: 'v3', auth });
    await drive.files.get({ fileId: DRIVE_FOLDER_ID, fields: 'id,name' });
    console.log('\n✅ Google Drive access successful!');
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
    console.log('========================================\n');
    startServer();
  } catch (err) {
    console.error('\n❌ Setup error:', err.message);
    process.exit(1);
  }
}

const tempDir = path.join(__dirname, "temp_uploads");
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

app.use(cors());
app.use(express.json());
const upload = multer({ dest: tempDir, limits: { fileSize: 50 * 1024 * 1024 } });

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

app.post("/api/upload", upload.single("file"), async (req, res) => {
  let tempPath = null;
  try {
    if (!req.file) return res.status(400).json({ success: false, error: "No file" });
    if (!drive) return res.status(500).json({ success: false, error: "Drive not initialized" });

    tempPath = req.file.path;
    const fileName = req.body.standardName || req.file.originalname;
    const employeeId = req.body.employeeId || "UNKNOWN";

    console.log(`📤 Uploading: ${employeeId} - ${fileName}`);

    const response = await drive.files.create({
      resource: { name: fileName, parents: [DRIVE_FOLDER_ID] },
      media: { mimeType: req.file.mimetype, body: fs.createReadStream(tempPath) },
      fields: "id,name"
    });

    const fileId = response.data.id;
    await drive.permissions.create({
      fileId,
      requestBody: { role: "reader", type: "anyone" }
    });

    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    console.log(`✅ Uploaded: ${fileId}`);

    res.json({
      success: true,
      fileId,
      fileName: response.data.name,
      previewUrl: `https://drive.google.com/file/d/${fileId}/view`
    });

  } catch (err) {
    console.error("❌ Upload error:", err.message);
    if (tempPath && fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    res.status(500).json({ success: false, error: err.message });
  }
});

function startServer() {
  app.listen(PORT, () => {
    console.log(`✨ Upload endpoint: http://localhost:${PORT}/api/upload`);
    console.log(`✨ Health check: http://localhost:${PORT}/api/health\n`);
  });
}

init();