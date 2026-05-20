 const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");
const readline = require("readline");

const app = express();
const PORT = 5000;
const DRIVE_FOLDER_ID = "1e_kR7RU8gKj5vD6SDClq1DcpkfEb-hlE";

console.log('========================================');
console.log('🚀 STARTING GOOGLE DRIVE UPLOAD SERVER');
console.log('========================================\n');

// OAuth credentials (embedded directly)
const OAUTH_CREDENTIALS = {
  installed: {
    client_id: "164658533548-rt09ov7o7galp73v8bgafp6f9ibscnme.apps.googleusercontent.com",
    project_id: "local-turbine-496806-f8",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_secret: "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",
    redirect_uris: ["http://localhost"]
  }
};

const { client_id, client_secret } = OAUTH_CREDENTIALS.installed;
const REDIRECT_URI = 'urn:ietf:wg:oauth:2.0:oob';
const TOKEN_FILE = 'token.json';

// Function to get new token
async function getNewToken() {
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);
  
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/drive'],
    prompt: 'consent'
  });

  console.log('\n🔐 FIRST TIME SETUP - Authorize this app:\n');
  console.log(authUrl);
  console.log('\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve, reject) => {
    rl.question('📝 Enter the code from that page: ', (code) => {
      rl.close();
      oauth2Client.getToken(code, (err, token) => {
        if (err) {
          reject(err);
        } else {
          fs.writeFileSync(TOKEN_FILE, JSON.stringify(token, null, 2));
          console.log('\n✅ Token saved! Restarting server...\n');
          resolve(token);
        }
      });
    });
  });
}

// Function to load or get token
async function getAuthenticatedClient() {
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);
  
  // Check if token exists
  if (fs.existsSync(TOKEN_FILE)) {
    const token = JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8'));
    oauth2Client.setCredentials(token);
    
    // Check if token is expired
    if (token.expiry_date && token.expiry_date < Date.now()) {
      console.log('🔄 Token expired, refreshing...');
      try {
        const { credentials } = await oauth2Client.refreshAccessToken();
        oauth2Client.setCredentials(credentials);
        fs.writeFileSync(TOKEN_FILE, JSON.stringify(credentials, null, 2));
        console.log('✅ Token refreshed!');
      } catch (err) {
        console.log('❌ Cannot refresh token, getting new one...');
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

// Initialize the app
let drive;

async function init() {
  try {
    const auth = await getAuthenticatedClient();
    drive = google.drive({ version: 'v3', auth });
    
    // Test folder access
    await drive.files.get({ fileId: DRIVE_FOLDER_ID, fields: 'id,name' });
    
    console.log('\n✅ Google Drive access successful!');
    console.log(`📁 Using your personal Gmail storage quota`);
    console.log(`🚀 Server ready on http://localhost:${PORT}`);
    console.log('========================================\n');
    
    // Start server only after successful auth
    startServer();
    
  } catch (err) {
    console.error('\n❌ Setup error:', err.message);
    console.log('\nPlease:');
    console.log('1. Make sure the folder ID is correct');
    console.log('2. You have access to this folder');
    console.log('3. Restart the server\n');
    process.exit(1);
  }
}

// Create temp folder
const tempDir = path.join(__dirname, "temp_uploads");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
  console.log('✅ Temp folder created');
}

// Middleware
app.use(cors());
app.use(express.json());
const upload = multer({ dest: tempDir, limits: { fileSize: 50 * 1024 * 1024 } });

// Health check
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Server running" });
});

// Upload endpoint
app.post("/api/upload", upload.single("file"), async (req, res) => {
  let tempPath = null;
  
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file" });
    }
    
    if (!drive) {
      return res.status(500).json({ success: false, error: "Drive not initialized" });
    }
    
    tempPath = req.file.path;
    const fileName = req.body.standardName || req.file.originalname;
    const employeeId = req.body.employeeId || "UNKNOWN";
    
    console.log(`📤 Uploading: ${employeeId} - ${fileName}`);
    console.log(`📁 Size: ${(req.file.size / 1024 / 1024).toFixed(2)} MB`);
    
    const response = await drive.files.create({
      resource: {
        name: fileName,
        parents: [DRIVE_FOLDER_ID]
      },
      media: {
        mimeType: req.file.mimetype,
        body: fs.createReadStream(tempPath)
      },
      fields: "id,name"
    });
    
    const fileId = response.data.id;
    
    // Make file public
    await drive.permissions.create({
      fileId: fileId,
      requestBody: { role: "reader", type: "anyone" }
    });
    
    // Cleanup
    if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    
    console.log(`✅ Uploaded: ${fileId}`);
    
    res.json({
      success: true,
      fileId: fileId,
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

// Start everything
init();