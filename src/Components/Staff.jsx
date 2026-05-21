 import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Staff.css';

// ─────────────────────────────────────────────────────────────
//  BACKEND URL  — change this when you deploy
// ─────────────────────────────────────────────────────────────
const BACKEND_URL = 'https://server-r5ni.onrender.com';

// ─── App constants ────────────────────────────────────────────
const DRIVE_FOLDER_NAME = 'DECO_Dolakha_Census_2082';
const OWNER_EMAIL       = 'dolakhaeconomiccensusoffice@gmail.com';
const DRIVE_RECORDS_KEY = 'driveUploadRecords_v1';
const STORAGE_KEY       = 'formRecordManagement_v1';

// ─── Nepal Time Zone Helper (UTC+5:45) ────────────────────────
const getNepalTime = () => {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utc + (345 * 60000)); // UTC+5:45 = 345 minutes
};

const getNepalTimeComponents = () => {
  const nepalTime = getNepalTime();
  return {
    hours: nepalTime.getHours(),
    minutes: nepalTime.getMinutes(),
    date: nepalTime.toISOString().split('T')[0],
    timeString: nepalTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
  };
};

const isCheckinAllowed = () => {
  const { hours, minutes } = getNepalTimeComponents();
  const totalMinutes = hours * 60 + minutes;
  // Check-in allowed between 8:00 AM (480 min) and 9:00 AM (540 min)
  return totalMinutes >= 480 && totalMinutes <= 540;
};

const isCheckoutAllowed = () => {
  const { hours, minutes } = getNepalTimeComponents();
  const totalMinutes = hours * 60 + minutes;
  // Check-out allowed between 5:00 PM (1020 min) and 6:00 PM (1080 min)
  return totalMinutes >= 1020 && totalMinutes <= 1080;
};

const getAttendanceStatus = (checkinTime) => {
  if (!checkinTime) return 'Absent';
  const [hours, minutes] = checkinTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes;
  // 8:00 AM = 480 min, 9:00 AM = 540 min
  if (totalMinutes <= 540) return 'Present';
  return 'Half Day';
};

// ─── Initial Data ─────────────────────────────────────────────
const INITIAL_DATA = [
  { sn: 1,  supervisor: 'रन्जिता वि.क',    municipality: 'गौरिशकर गा.पा',  enumerator: 'हरि बहादुर खत्री',    code: 'E01', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 2,  supervisor: 'रन्जिता वि.क',    municipality: 'गौरिशकर गा.पा',  enumerator: 'रीता खड्का',          code: 'E02', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 3,  supervisor: 'रन्जिता वि.क',    municipality: 'गौरिशकर गा.पा',  enumerator: 'गोविन्द वि.क',        code: 'E03', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 4,  supervisor: 'रन्जिता वि.क',    municipality: 'बि.गु. गा.पा',   enumerator: 'ओङ्दी शेर्पा',        code: 'E04', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 5,  supervisor: 'रन्जिता वि.क',    municipality: 'बि.गु. गा.पा',   enumerator: 'पार्बती थापा',        code: 'E05', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 6,  supervisor: 'रन्जिता वि.क',    municipality: 'बि.गु. गा.पा',   enumerator: 'उषा अर्याल',          code: 'E06', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 7,  supervisor: 'रुथ श्रेष्ठ',     municipality: 'कालिन्चोक गा.पा', enumerator: 'गौरव शिवाकोटी',      code: 'E07', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 8,  supervisor: 'रुथ श्रेष्ठ',     municipality: 'कालिन्चोक गा.पा', enumerator: 'नमिका आचार्य',        code: 'E08', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 9,  supervisor: 'रुथ श्रेष्ठ',     municipality: 'कालिन्चोक गा.पा', enumerator: 'अम्बिका कठेत',        code: 'E09', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, remainingWithSupervisor: 0 },
  { sn: 10, supervisor: 'रुथ श्रेष्ठ',     municipality: 'कालिन्चोक गा.पा', enumerator: 'अजिता ओली',           code: 'E10', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 11, supervisor: 'सुमित्रा जिरेल',  municipality: 'बैतेश्वर गा.पा',  enumerator: 'निराजन घतानी',        code: 'E11', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 12, supervisor: 'सुमित्रा जिरेल',  municipality: 'बैतेश्वर गा.पा',  enumerator: 'प्रमिला तमाङ',        code: 'E12', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 13, supervisor: 'सुमित्रा जिरेल',  municipality: 'बैतेश्वर गा.पा',  enumerator: 'जानुका मिजार',        code: 'E13', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 14, supervisor: 'सुमित्रा जिरेल',  municipality: 'जिरी न.पा.',      enumerator: 'अनिशा जिरेल',         code: 'E14', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 15, supervisor: 'सुमित्रा जिरेल',  municipality: 'जिरी न.पा.',      enumerator: 'सन्जित जिरेल',        code: 'E15', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 16, supervisor: 'सुमित्रा जिरेल',  municipality: 'जिरी न.पा.',      enumerator: 'दर्शन थापा',          code: 'E16', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 17, supervisor: 'विक्रम शिवाकोटी', municipality: 'तामाकोशी गा.पा',  enumerator: 'राजेश सार्की',        code: 'E17', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 18, supervisor: 'विक्रम शिवाकोटी', municipality: 'तामाकोशी गा.पा',  enumerator: 'मनिता फुयाल',         code: 'E18', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 19, supervisor: 'विक्रम शिवाकोटी', municipality: 'तामाकोशी गा.पा',  enumerator: 'अनिशा बस्नेत',        code: 'E19', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 20, supervisor: 'विक्रम शिवाकोटी', municipality: 'शैलुङ गा.पा',     enumerator: 'निरोज सापकोटा',       code: 'E20', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 21, supervisor: 'विक्रम शिवाकोटी', municipality: 'शैलुङ गा.पा',     enumerator: 'निरु भण्डारी',        code: 'E21', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 22, supervisor: 'विक्रम शिवाकोटी', municipality: 'शैलुङ गा.पा',     enumerator: 'सबिता थपलिया',        code: 'E22', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 23, supervisor: 'विक्रम शिवाकोटी', municipality: 'मेलुङ गा.पा',     enumerator: 'शृजना मिजार',         code: 'E23', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 24, supervisor: 'विक्रम शिवाकोटी', municipality: 'मेलुङ गा.पा',     enumerator: 'अपेक्षा थापा',        code: 'E24', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 25, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'दिपा कार्की',         code: 'E25', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 26, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'शान्त प्रसाद सुवेदि', code: 'E26', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 27, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'धन कुमारी थामि',      code: 'E27', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 28, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'प्रेङका ओली',         code: 'E28', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 29, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'साजन ठकुरी',          code: 'E29', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 30, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'रन्जना के.सी',        code: 'E30', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 31, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'अमृत कुमार मुग्राती', code: 'E31', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 32, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'सचिन बस्नेत',         code: 'E32', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
  { sn: 33, supervisor: 'रेणुका थामी',      municipality: 'भिमेश्वर न.पा',  enumerator: 'अरुणा लगुन',          code: 'E33', totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0, checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0 },
];

const MUNICIPALITIES = [...new Set(INITIAL_DATA.map(d => d.municipality))];
const SUPERVISORS    = [...new Set(INITIAL_DATA.map(d => d.supervisor))];
const EMPTY_RECORD   = {
  sn: '', supervisor: '', municipality: '', enumerator: '', code: '',
  totalFilled: 0, transferredToSupervisor: 0, remainingWithEnumerator: 0,
  checkedBySupervisor: 0, transferredToDistrict: 0, remainingWithSupervisor: 0,
};

// ─── Helpers ──────────────────────────────────────────────────
const pct = (val, total) => total > 0 ? Math.min(100, Math.round((val / total) * 100)) : 0;

const generateStandardFileName = (originalFile, employeeId) => {
  const now  = getNepalTime();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '-');
  const ext  = originalFile.name.includes('.') ? '.' + originalFile.name.split('.').pop() : '';
  const base = originalFile.name.includes('.')
    ? originalFile.name.substring(0, originalFile.name.lastIndexOf('.'))
    : originalFile.name;
  const safe = base.replace(/[^a-zA-Z0-9_\-]/g, '_');
  return `${date}_${time}_${employeeId}_${safe}${ext}`;
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const getFileIcon = (type, mimeType = '') => {
  if (type === 'image' || mimeType.includes('image')) return '🖼️';
  if (type === 'pdf' || mimeType.includes('pdf')) return '📕';
  if (type === 'excel' || mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
  if (type === 'docs' || mimeType.includes('word') || mimeType.includes('document')) return '📝';
  return '📄';
};

// ─── API Helpers for MongoDB ──────────────────────────────────
const saveAttendanceToMongo = async (attendanceData) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/attendance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(attendanceData)
    });
    const result = await response.json();
    if (!result.success) throw new Error(result.error);
    return result;
  } catch (error) {
    console.error('Failed to save attendance to MongoDB:', error);
    return null;
  }
};

const loadAttendanceFromMongo = async (employeeId) => {
  try {
    const response = await fetch(`${BACKEND_URL}/api/attendance/${employeeId}`);
    const result = await response.json();
    if (result.success && result.data) {
      localStorage.setItem(`attendance_${employeeId}`, JSON.stringify(result.data));
      return result.data;
    }
    return null;
  } catch (error) {
    console.error('Failed to load attendance from MongoDB:', error);
    return null;
  }
};

// ─── Upload Queue Manager ─────────────────────────────────────
class UploadQueue {
  constructor() {
    this.processing = new Set();
    this.completed  = new Map();
  }
  isProcessing(key) { return this.processing.has(key); }
  isCompleted(key)  { return this.completed.has(key); }
  getResult(key)    { return this.completed.get(key); }
  start(key)        { this.processing.add(key); }
  finish(key, result) {
    this.processing.delete(key);
    this.completed.set(key, result);
  }
  clear() { this.processing.clear(); this.completed.clear(); }
}

// ─── Main Staff Component ─────────────────────────────────────
const Staff = () => {

  // ── Core State ──────────────────────────────────────────────
  const [user, setUser]         = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // ── Submit guard ─────────────────────────────────────────────
  const isSubmittingRef    = useRef(false);
  const uploadQueueRef     = useRef(new UploadQueue());
  const formResetKeyRef    = useRef(0);

  // ── Upload state ─────────────────────────────────────────────
  const [isSubmitting, setIsSubmitting]     = useState(false);
  const [submitProgress, setSubmitProgress] = useState({ current: 0, total: 0, label: '' });

  // ── Backend / Drive status ───────────────────────────────────
  const [backendOnline, setBackendOnline]   = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [driveStatusMsg, setDriveStatusMsg] = useState('');
  const [driveError, setDriveError]         = useState('');

  // ── Drive records ────────────────────────────────────────────
  const [driveRecords, setDriveRecords] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DRIVE_RECORDS_KEY) || '[]'); } catch { return []; }
  });
  const [driveFiles, setDriveFiles]         = useState([]);
  const [showDrivePanel, setShowDrivePanel] = useState(false);
  const [showDriveModal, setShowDriveModal] = useState(false);
  const [driveFilter, setDriveFilter]       = useState('all');
  const [driveSearch, setDriveSearch]       = useState('');

  // ── Work & Attendance ────────────────────────────────────────
  const [workEntries, setWorkEntries]             = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [filterDate, setFilterDate]               = useState('');
  const [tokenCounter, setTokenCounter]           = useState(1000);
  const [generatedToken, setGeneratedToken]       = useState('');
  const [showTokenModal, setShowTokenModal]       = useState(false);
  const [showForm, setShowForm]                   = useState(false);
  const [editingEntry, setEditingEntry]           = useState(null);
  const [newEntry, setNewEntry]                   = useState({
    date: getNepalTime().toISOString().split('T')[0],
    totalCount: '', hoursWorked: '', description: '', status: 'pending',
  });

  // ── Attendance Modal ─────────────────────────────────────────
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceType, setAttendanceType]           = useState('checkin');
  const [currentLocation, setCurrentLocation]         = useState(null);
  const [locationError, setLocationError]             = useState('');
  const [isGettingLocation, setIsGettingLocation]     = useState(false);
  const [locationPlaceName, setLocationPlaceName]     = useState('');
  const [workDescription, setWorkDescription]         = useState('');
  const [isTracking, setIsTracking]                   = useState(false);
  const [watchId, setWatchId]                         = useState(null);
  const [liveLocation, setLiveLocation]               = useState(null);

  // ── Documents ────────────────────────────────────────────────
  const [documents, setDocuments]                 = useState([]);
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview]           = useState(null);
  const [pendingEntryFiles, setPendingEntryFiles] = useState([]);
  const [pendingFileType, setPendingFileType]     = useState('pdf');
  const [fileNamePreviews, setFileNamePreviews]   = useState([]);

  // ── Password ─────────────────────────────────────────────────
  const [showChangePassword, setShowChangePassword]   = useState(false);
  const [passwordChangeData, setPasswordChangeData]   = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd]         = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  // ── Notifications & Notices ──────────────────────────────────
  const [notifications, setNotifications]       = useState([]);
  const [notices, setNotices]                   = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount]           = useState(0);

  // ── Form Record Management ───────────────────────────────────
  const [formRecords, setFormRecords] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DATA;
    } catch { return INITIAL_DATA; }
  });
  const [frmView, setFrmView]                           = useState('folders');
  const [selectedMunicipality, setSelectedMunicipality] = useState(null);
  const [editModal, setEditModal]                       = useState(null);
  const [search, setSearch]                             = useState('');
  const [editForm, setEditForm]                         = useState(EMPTY_RECORD);
  const [toast, setToast]                               = useState(null);
  const [confirmDelete, setConfirmDelete]               = useState(null);

  // ── Extra UI features ────────────────────────────────────────
  const [activeTab, setActiveTab]         = useState('dashboard');
  const [showUploadTip, setShowUploadTip] = useState(false);
  const [entryViewMode, setEntryViewMode] = useState('table');

  const fileTypeAccept = { pdf: '.pdf', image: '.jpg,.jpeg,.png,.gif,.webp', docs: '.doc,.docx', excel: '.xlsx,.xls,.csv' };
  const fileTypeLabel  = { pdf: '📕 PDF', image: '🖼️ Image', docs: '📝 Docs', excel: '📊 Excel' };

  // ─────────────────────────────────────────────────────────────
  //  BACKEND HEALTH
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch(`${BACKEND_URL}/api/health`)
      .then(r => r.json())
      .then(() => {
        setBackendOnline(true);
        setDriveStatusMsg('✅ Backend connected — files will auto-upload to Google Drive');
      })
      .catch(() => {
        setBackendOnline(false);
        setDriveStatusMsg('⚠️ Backend offline — start server.js to enable Drive uploads');
      });
  }, []);

  // ─────────────────────────────────────────────────────────────
  //  UPLOAD TO GOOGLE DRIVE — with dedup via uploadQueueRef
  // ─────────────────────────────────────────────────────────────
  const buildStandardName = useCallback(
    (file) => generateStandardFileName(file, user?.id || 'UNKNOWN'),
    [user]
  );

  const uploadToGoogleDrive = async (file, standardName) => {
    if (!backendOnline) return null;

    const queue = uploadQueueRef.current;
    if (queue.isProcessing(standardName)) {
      console.warn('[Drive] Already uploading:', standardName);
      return null;
    }
    if (queue.isCompleted(standardName)) {
      console.info('[Drive] Already uploaded:', standardName);
      return queue.getResult(standardName);
    }

    queue.start(standardName);

    try {
      setUploadProgress(prev => ({ ...prev, [standardName]: 0 }));
      setDriveStatusMsg(`⬆️ Uploading ${standardName}...`);

      const formData = new FormData();
      formData.append('file',         file);
      formData.append('standardName', standardName);
      formData.append('employeeId',   user?.id || 'UNKNOWN');
      formData.append('fileType',     file.type);

      const response = await fetch(`${BACKEND_URL}/api/upload`, {
        method: 'POST',
        body:   formData,
      });

      const result = await response.json();

      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[standardName];
        return next;
      });

      if (!result.success) throw new Error(result.error || 'Upload failed');

      queue.finish(standardName, result);
      setDriveStatusMsg(`✅ "${standardName}" saved to Google Drive`);
      setDriveError('');
      return result;

    } catch (err) {
      console.error('[Drive Upload Error]', err);
      queue.finish(standardName, null);
      setDriveError(`Upload failed: ${err.message}`);
      setDriveStatusMsg('⚠️ Upload failed — file saved locally only');
      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[standardName];
        return next;
      });
      return null;
    }
  };

  const saveDriveRecord = (originalName, standardName, driveResult, employeeId, employeeName, fileType) => {
    const record = {
      id:           Date.now() + Math.random(),
      originalName,
      standardName,
      driveId:      driveResult?.id         || null,
      driveLink:    driveResult?.webViewLink || null,
      driveSize:    driveResult?.size        || null,
      employeeId,
      employeeName,
      fileType,
      uploadedAt:   new Date().toISOString(),
      savedToDrive: !!driveResult,
    };
    setDriveRecords(prev => {
      if (prev.some(r => r.standardName === standardName)) return prev;
      const updated = [record, ...prev];
      localStorage.setItem(DRIVE_RECORDS_KEY, JSON.stringify(updated));
      return updated;
    });

    const driveFileRecord = {
      id:                  record.id,
      name:                standardName,
      originalName,
      driveId:             driveResult?.id       || null,
      webViewLink:         driveResult?.webViewLink || null,
      type:                fileType,
      size:                driveResult?.size      || 0,
      uploadDate:          record.uploadedAt,
      uploadDateFormatted: new Date().toLocaleDateString('en-GB'),
      uploadTime:          new Date().toLocaleTimeString('en-GB'),
      employeeId,
      employeeName,
      savedToDrive:        !!driveResult,
    };
    setDriveFiles(prev => {
      if (prev.some(f => f.name === standardName)) return prev;
      const updated = [driveFileRecord, ...prev];
      localStorage.setItem(`driveFiles_${employeeId}`, JSON.stringify(updated));
      return updated;
    });

    return record;
  };

  const uploadFileWithAutoName = async (file, docType, description, empId = null) => {
    const standardName = buildStandardName(file);
    const targetId     = empId || user.id;

    const driveResult = await uploadToGoogleDrive(file, standardName);
    saveDriveRecord(file.name, standardName, driveResult, targetId, user.name, docType);

    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const doc = {
          id:           Date.now() + Math.random(),
          name:         standardName,
          originalName: file.name,
          type:         docType,
          description,
          size:         file.size,
          data:         reader.result,
          mimeType:     file.type,
          uploadDate:   new Date().toISOString(),
          employeeId:   targetId,
          employeeName: user.name,
          driveId:      driveResult?.id         || null,
          driveLink:    driveResult?.webViewLink || null,
          savedToDrive: !!driveResult,
        };
        setDocuments(prev => {
          if (prev.some(d => d.name === standardName)) return prev;
          const existing = [doc, ...prev];
          localStorage.setItem(`documents_${targetId}`, JSON.stringify(existing));
          return existing;
        });
        resolve(doc);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteFromDrive = async (recordId, driveId) => {
    if (!window.confirm('Delete this file from Google Drive? This cannot be undone.')) return;
    try {
      if (backendOnline && driveId) {
        const res    = await fetch(`${BACKEND_URL}/api/delete/${driveId}`, { method: 'DELETE' });
        const result = await res.json();
        if (!result.success) throw new Error(result.error);
      }
      setDriveRecords(prev => {
        const u = prev.filter(r => r.id !== recordId);
        localStorage.setItem(DRIVE_RECORDS_KEY, JSON.stringify(u));
        return u;
      });
      setDriveFiles(prev => {
        const u = prev.filter(f => f.id !== recordId);
        localStorage.setItem(`driveFiles_${user.id}`, JSON.stringify(u));
        return u;
      });
      setDocuments(prev => {
        const u = prev.filter(d => d.id !== recordId);
        localStorage.setItem(`documents_${user.id}`, JSON.stringify(u));
        return u;
      });
      showToast('🗑️ File deleted', 'warn');
    } catch (e) {
      console.error('Delete error:', e);
      alert('❌ Failed to delete from Drive: ' + e.message);
    }
  };

  const openInDrive = (link) => { if (link) window.open(link, '_blank'); };

  // ─── Attendance helpers with Nepal Time ───────────────────────
  const canCheckin = () => {
    const { hours, minutes } = getNepalTimeComponents();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= 480 && totalMinutes <= 540;
  };

  const canCheckout = () => {
    const { hours, minutes } = getNepalTimeComponents();
    const totalMinutes = hours * 60 + minutes;
    return totalMinutes >= 1020 && totalMinutes <= 1080;
  };

  const getCheckinTimeMessage = () => {
    const { hours, minutes } = getNepalTimeComponents();
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 480) return `Check-in starts at 8:00 AM Nepal Time (${Math.floor((480 - totalMinutes) / 60)}h ${(480 - totalMinutes) % 60}m remaining)`;
    if (totalMinutes > 540) return `Check-in closed after 9:00 AM Nepal Time. You'll be marked as Late/Half Day if you check in now.`;
    return null;
  };

  const getCheckoutTimeMessage = () => {
    const { hours, minutes } = getNepalTimeComponents();
    const totalMinutes = hours * 60 + minutes;
    if (totalMinutes < 1020) return `Check-out starts at 5:00 PM Nepal Time (${Math.floor((1020 - totalMinutes) / 60)}h ${(1020 - totalMinutes) % 60}m remaining)`;
    if (totalMinutes > 1080) return `Check-out closed after 6:00 PM Nepal Time. Please contact admin.`;
    return null;
  };

  const getPlaceName = async (lat, lng) => {
    try {
      const res  = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await res.json();
      if (data?.display_name) return data.display_name.split(',').slice(0, 3).join(', ');
    } catch {}
    return `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
  };

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    if (!navigator.geolocation) { setLocationError('Geolocation not supported'); setIsGettingLocation(false); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const loc = { lat: pos.coordinates.latitude, lng: pos.coordinates.longitude, accuracy: pos.coordinates.accuracy };
        setCurrentLocation(loc);
        setLocationPlaceName(await getPlaceName(loc.lat, loc.lng));
        setIsGettingLocation(false);
      },
      err => {
        setIsGettingLocation(false);
        const msgs = { 1: 'Permission denied. Enable GPS.', 2: 'Location unavailable.', 3: 'Request timed out.' };
        setLocationError(msgs[err.code] || 'Error getting location.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) return;
    setIsTracking(true);
    const id = navigator.geolocation.watchPosition(
      async pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy };
        setLiveLocation(loc);
        setLocationPlaceName(await getPlaceName(loc.lat, loc.lng));
      },
      err => console.error('Tracking error:', err),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
    setWatchId(id);
  };

  const stopLocationTracking = () => {
    if (watchId) { navigator.geolocation.clearWatch(watchId); setWatchId(null); }
    setIsTracking(false);
    setLiveLocation(null);
  };

  const markAttendance = async () => {
    if (!currentLocation) { alert('❌ Please get your location first'); return; }
    
    const { timeString, date: currentDate, hours, minutes } = getNepalTimeComponents();
    const totalMinutes = hours * 60 + minutes;
    
    let status = '';
    let isValid = true;
    let errorMsg = '';

    if (attendanceType === 'checkin') {
      if (!canCheckin()) {
        if (totalMinutes < 480) {
          errorMsg = `❌ Check-in starts at 8:00 AM Nepal Time. Please wait until 8:00 AM.`;
        } else if (totalMinutes > 540) {
          status = 'Half Day';
          const confirmLate = window.confirm(`⚠️ It's after 9:00 AM Nepal Time. You'll be marked as "Half Day". Do you still want to check in?`);
          if (!confirmLate) isValid = false;
        }
      } else {
        status = 'Present';
      }
    } else if (attendanceType === 'checkout') {
      if (!canCheckout()) {
        if (totalMinutes < 1020) {
          errorMsg = `❌ Check-out starts at 5:00 PM Nepal Time. Please wait until 5:00 PM.`;
        } else if (totalMinutes > 1080) {
          errorMsg = `❌ Check-out closed after 6:00 PM Nepal Time. Please contact admin.`;
        }
        isValid = false;
      }
    }

    if (errorMsg) {
      alert(errorMsg);
      setShowAttendanceModal(false);
      setCurrentLocation(null);
      setLocationPlaceName('');
      stopLocationTracking();
      return;
    }

    if (!isValid) {
      setShowAttendanceModal(false);
      setCurrentLocation(null);
      setLocationPlaceName('');
      stopLocationTracking();
      return;
    }

    const record = {
      id: Date.now(),
      employeeId: user.id,
      employeeName: user.name,
      date: currentDate,
      checkIn: attendanceType === 'checkin' ? timeString : '',
      checkOut: attendanceType === 'checkout' ? timeString : '',
      status: status || (attendanceType === 'checkout' ? getAttendanceStatus(attendanceRecords.find(r => r.date === currentDate)?.checkIn) : ''),
      workDescription,
      location: {
        lat: currentLocation.lat,
        lng: currentLocation.lng,
        accuracy: currentLocation.accuracy
      },
      locationPlaceName,
      timestamp: getNepalTime().toISOString(),
      attendanceType,
      nepalTime: timeString
    };

    let existing = [...attendanceRecords];
    const idx = existing.findIndex(r => r.date === currentDate);

    if (idx >= 0) {
      if (attendanceType === 'checkin') {
        if (existing[idx].checkIn) {
          alert('❌ You already checked in today!');
          setShowAttendanceModal(false);
          setCurrentLocation(null);
          setLocationPlaceName('');
          stopLocationTracking();
          return;
        }
        existing[idx] = { ...existing[idx], ...record, status };
      } else {
        if (existing[idx].checkOut) {
          alert('❌ You already checked out today!');
          setShowAttendanceModal(false);
          setCurrentLocation(null);
          setLocationPlaceName('');
          stopLocationTracking();
          return;
        }
        if (!existing[idx].checkIn) {
          alert('❌ Please check in first before checking out.');
          setShowAttendanceModal(false);
          setCurrentLocation(null);
          setLocationPlaceName('');
          stopLocationTracking();
          return;
        }
        existing[idx].checkOut = timeString;
        existing[idx].workDescription = workDescription;
        existing[idx].location = record.location;
        existing[idx].locationPlaceName = locationPlaceName;
        existing[idx].status = getAttendanceStatus(existing[idx].checkIn);
      }
    } else if (attendanceType === 'checkin') {
      existing.push(record);
    } else {
      alert('❌ Please check in first.');
      setShowAttendanceModal(false);
      setCurrentLocation(null);
      setLocationPlaceName('');
      stopLocationTracking();
      return;
    }

    setAttendanceRecords(existing);
    localStorage.setItem(`attendance_${user.id}`, JSON.stringify(existing));
    
    // Save to MongoDB
    await saveAttendanceToMongo({
      employeeId: user.id,
      employeeName: user.name,
      records: existing
    });

    const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
    allNotifs.unshift({
      id: Date.now(),
      title: '📍 Attendance Marked',
      message: `${user.name} (${user.id}) marked ${attendanceType} at ${timeString} Nepal Time. Location: ${locationPlaceName.substring(0, 50)}. Status: ${status || 'Updated'}.`,
      type: 'attendance',
      for: 'admin',
      employeeId: user.id,
      timestamp: getNepalTime().toISOString(),
      read: false
    });
    allNotifs.unshift({
      id: Date.now() + 1,
      title: '✅ Attendance Confirmed',
      message: `You marked ${attendanceType} at ${timeString} Nepal Time. Location: ${locationPlaceName.substring(0, 50)}`,
      type: 'attendance',
      for: 'staff',
      employeeId: user.id,
      timestamp: getNepalTime().toISOString(),
      read: false
    });
    localStorage.setItem('notifications', JSON.stringify(allNotifs));

    setAttendanceType('checkin');
    setWorkDescription('');
    setCurrentLocation(null);
    setLocationPlaceName('');
    setShowAttendanceModal(false);
    stopLocationTracking();
    
    alert(`✅ ${attendanceType === 'checkin' ? 'Check-in' : 'Check-out'} successful!\n🕐 Nepal Time: ${timeString}\n📍 ${locationPlaceName.substring(0, 50)}\n📊 Status: ${status || 'Updated'}`);
  };

  const quickCheckIn = () => {
    const { date: currentDate } = getNepalTimeComponents();
    const todayRecord = attendanceRecords.find(r => r.date === currentDate);
    if (todayRecord?.checkIn) {
      alert('❌ You already checked in today!');
      return;
    }
    if (!canCheckin()) {
      const msg = getCheckinTimeMessage();
      if (msg && !msg.includes('Late')) {
        alert(msg);
        return;
      }
    }
    setAttendanceType('checkin');
    setShowAttendanceModal(true);
  };

  const quickCheckOut = () => {
    const { date: currentDate, hours, minutes } = getNepalTimeComponents();
    const todayRecord = attendanceRecords.find(r => r.date === currentDate);
    if (!todayRecord?.checkIn) {
      alert('❌ Please check in first.');
      return;
    }
    if (todayRecord?.checkOut) {
      alert('❌ You already checked out today!');
      return;
    }
    if (!canCheckout()) {
      const msg = getCheckoutTimeMessage();
      alert(msg);
      return;
    }
    setAttendanceType('checkout');
    setShowAttendanceModal(true);
  };

  // ─── Password ─────────────────────────────────────────────────
  const changePassword = (userId, oldPwd, newPwd) => {
    const sys = JSON.parse(localStorage.getItem('passwordSystem') || '{}');
    if (!sys[userId] || sys[userId].password !== btoa(oldPwd)) return false;
    sys[userId].password  = btoa(newPwd);
    sys[userId].lastReset = new Date().toISOString();
    localStorage.setItem('passwordSystem', JSON.stringify(sys));
    return true;
  };

  const handlePasswordChange = e => {
    e.preventDefault();
    if (passwordChangeData.newPassword !== passwordChangeData.confirmPassword) { alert('Passwords do not match'); return; }
    if (passwordChangeData.newPassword.length < 6) { alert('Min 6 characters'); return; }
    if (changePassword(user.id, passwordChangeData.currentPassword, passwordChangeData.newPassword)) {
      alert('Password changed! Please login again.');
      localStorage.removeItem('user'); localStorage.removeItem('userRole');
      window.location.reload();
    } else alert('Current password incorrect');
  };

  // ─── Token ────────────────────────────────────────────────────
  const generateCensusToken = () => {
    const token = `DOL${getNepalTime().getFullYear()}${String(tokenCounter).padStart(6, '0')}`;
    setGeneratedToken(token);
    setTokenCounter(prev => {
      const next = prev + 1;
      localStorage.setItem('tokenCounter', String(next));
      return next;
    });
    return token;
  };

  // ─── RESET FORM STATE ─────────────────────────────────────────
  const resetForm = () => {
    setNewEntry({
      date: getNepalTime().toISOString().split('T')[0],
      totalCount: '',
      hoursWorked: '',
      description: '',
      status: 'pending'
    });
    setPendingEntryFiles([]);
    setSelectedPhotoFile(null);
    setPhotoPreview(null);
    setEditingEntry(null);
    setFileNamePreviews([]);
    formResetKeyRef.current += 1;
    uploadQueueRef.current.clear();
  };

  // ─── File handlers ────────────────────────────────────────────
  const handlePhotoSelect = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('File must be < 5MB'); return; }
    setSelectedPhotoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    reader.readAsDataURL(file);
    const standardName = buildStandardName(file);
    setFileNamePreviews(prev => [...prev.filter(p => p.fileType !== 'Photo'), { originalName: file.name, standardName, fileType: 'Photo' }]);
  };

  const handlePendingFileSelect = e => {
    const file = e.target.files[0];
    if (!file) return;
    if (pendingEntryFiles.some(pf => pf.file.name === file.name && pf.file.size === file.size)) {
      alert('This file is already attached.'); e.target.value = ''; return;
    }
    const standardName = buildStandardName(file);
    setPendingEntryFiles(prev => [...prev, { file, type: pendingFileType, standardName }]);
    setFileNamePreviews(prev => [...prev, { originalName: file.name, standardName, fileType: fileTypeLabel[pendingFileType] }]);
    e.target.value = '';
  };

  // ─────────────────────────────────────────────────────────────
  //  HANDLE SUBMIT ENTRY
  // ─────────────────────────────────────────────────────────────
  const handleSubmitEntry = async e => {
    e.preventDefault();
    e.stopPropagation();

    if (isSubmittingRef.current) {
      console.warn('[Submit] Already submitting, ignoring duplicate call');
      return;
    }
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const censusToken = generateCensusToken();
      const entryId = Date.now();

      const photoFileSnapshot = selectedPhotoFile;
      const pendingFilesSnapshot = [...pendingEntryFiles];

      let photoData = null;
      let uploadedFiles = [];
      const totalFiles = (photoFileSnapshot ? 1 : 0) + (editingEntry ? 0 : pendingFilesSnapshot.length);
      let uploadedCount = 0;

      setSubmitProgress({ current: 0, total: totalFiles, label: 'Preparing upload...' });

      if (photoFileSnapshot) {
        setSubmitProgress({ current: uploadedCount, total: totalFiles, label: `Uploading photo...` });
        const doc = await uploadFileWithAutoName(photoFileSnapshot, 'image', `Photo for census entry ${newEntry.date}`, null);
        if (doc) { photoData = doc; uploadedFiles.push(doc); }
        uploadedCount++;
        setSubmitProgress({ current: uploadedCount, total: totalFiles, label: `Photo uploaded` });
      }

      if (!editingEntry) {
        for (let i = 0; i < pendingFilesSnapshot.length; i++) {
          const pf = pendingFilesSnapshot[i];
          setSubmitProgress({ current: uploadedCount, total: totalFiles, label: `Uploading ${pf.file.name}...` });
          const doc = await uploadFileWithAutoName(pf.file, pf.type, `Attached to census entry: ${newEntry.date}`, null);
          if (doc) uploadedFiles.push(doc);
          uploadedCount++;
          setSubmitProgress({ current: uploadedCount, total: totalFiles, label: `${i + 1}/${pendingFilesSnapshot.length} files uploaded` });
          if (i < pendingFilesSnapshot.length - 1) await new Promise(r => setTimeout(r, 200));
        }
      }

      setSubmitProgress({ current: totalFiles, total: totalFiles, label: 'Saving entry...' });

      let updatedEntries;
      if (editingEntry) {
        updatedEntries = workEntries.map(en =>
          en.id === editingEntry.id
            ? { ...newEntry, id: en.id, employeeId: user.id, hoursWorked: parseFloat(newEntry.hoursWorked), totalCount: parseInt(newEntry.totalCount), censusToken: en.censusToken }
            : en
        );
      } else {
        const entry = {
          ...newEntry, id: entryId, employeeId: user.id, employeeName: user.name,
          hoursWorked: parseFloat(newEntry.hoursWorked),
          totalCount: parseInt(newEntry.totalCount),
          censusToken,
          attachedFiles: pendingFilesSnapshot.map(f => f.standardName || f.file.name),
          hasPhoto: !!photoData,
          photoId: photoData?.id,
          driveFileIds: uploadedFiles.map(f => f.id),
          createdAt: new Date().toISOString(),
        };
        updatedEntries = [entry, ...workEntries];
        setShowTokenModal(true);
      }

      setWorkEntries(updatedEntries);
      localStorage.setItem(`workData_${user.id}`, JSON.stringify(updatedEntries));

      const allNotifs = JSON.parse(localStorage.getItem('notifications') || '[]');
      allNotifs.unshift({ id: Date.now(), title: '📋 Census Entry Added', message: `${user.id} added entry — Count: ${newEntry.totalCount}, Token: ${censusToken}, Files: ${uploadedFiles.length}`, type: 'work', for: 'admin', employeeId: user.id, timestamp: new Date().toISOString(), read: false });
      localStorage.setItem('notifications', JSON.stringify(allNotifs));

      resetForm();
      setShowForm(false);
      showToast(editingEntry ? '✅ Entry updated successfully' : `✅ Entry added! Token: ${censusToken}`, 'success');

    } catch (err) {
      console.error('[Submit Error]', err);
      showToast('❌ Failed to save entry: ' + err.message, 'error');
    } finally {
      isSubmittingRef.current = false;
      setIsSubmitting(false);
      setSubmitProgress({ current: 0, total: 0, label: '' });
    }
  };

  const handleEditEntry = entry => { setEditingEntry(entry); setNewEntry({ ...entry }); setShowForm(true); };
  const handleDeleteEntry = id => {
    if (!window.confirm('Delete this entry?')) return;
    const updated = workEntries.filter(e => e.id !== id);
    setWorkEntries(updated);
    localStorage.setItem(`workData_${user.id}`, JSON.stringify(updated));
    showToast('🗑️ Entry deleted', 'warn');
  };

  const deleteDocument = docId => {
    if (!window.confirm('Delete this document?')) return;
    const updated = documents.filter(d => d.id !== docId);
    localStorage.setItem(`documents_${user.id}`, JSON.stringify(updated));
    setDocuments(updated);
  };

  // ─── Notifications ────────────────────────────────────────────
  const loadNotifications = useCallback(() => {
    if (!user) return;
    const all = JSON.parse(localStorage.getItem('notifications') || '[]');
    const mine = all.filter(n => n.employeeId === user.id || n.for === 'all' || n.for === 'staff');
    setNotifications(mine);
    setUnreadCount(mine.filter(n => !n.read).length);
  }, [user]);

  const markAsRead = id => {
    const all = JSON.parse(localStorage.getItem('notifications') || '[]');
    localStorage.setItem('notifications', JSON.stringify(all.map(n => n.id === id ? { ...n, read: true } : n)));
    loadNotifications();
  };

  // ─── Toast ────────────────────────────────────────────────────
  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  // ─── Form Records ─────────────────────────────────────────────
  const frmSaveRecord = () => {
    const rec = {
      ...editForm,
      sn: editForm.sn || formRecords.length + 1,
      totalFilled: +editForm.totalFilled || 0,
      transferredToSupervisor: +editForm.transferredToSupervisor || 0,
      remainingWithEnumerator: +editForm.remainingWithEnumerator || 0,
      checkedBySupervisor: +editForm.checkedBySupervisor || 0,
      transferredToDistrict: +editForm.transferredToDistrict || 0,
      remainingWithSupervisor: +editForm.remainingWithSupervisor || 0,
    };
    let updated;
    if (editModal.isNew) { updated = [...formRecords, rec]; showToast(`✅ ${rec.enumerator} added`); }
    else { updated = formRecords.map(r => r.code === rec.code ? rec : r); showToast(`✅ ${rec.enumerator} updated`); }
    setFormRecords(updated); setEditModal(null);
  };

  const frmDeleteRecord = code => {
    setFormRecords(formRecords.filter(r => r.code !== code));
    setConfirmDelete(null);
    showToast('🗑️ Record deleted', 'warn');
  };

  const frmOpenEdit = record => { setEditForm({ ...record }); setEditModal({ record, isNew: false }); };
  const frmOpenAdd = () => {
    const n = formRecords.length + 1;
    setEditForm({ ...EMPTY_RECORD, sn: n, code: `E${String(n).padStart(2, '0')}` });
    setEditModal({ record: null, isNew: true });
  };
  const ef = (field, val) => setEditForm(f => ({ ...f, [field]: val }));

  // ─── Derived ──────────────────────────────────────────────────
  const folderGroups = MUNICIPALITIES.map(mun => {
    const items = formRecords.filter(r => r.municipality === mun);
    const totalFilled = items.reduce((s, r) => s + r.totalFilled, 0);
    const totalTransferred = items.reduce((s, r) => s + r.transferredToDistrict, 0);
    return { mun, items, totalFilled, totalTransferred, count: items.length };
  });

  const filteredInFolder = selectedMunicipality
    ? formRecords.filter(r =>
        r.municipality === selectedMunicipality &&
        (!search || r.enumerator.toLowerCase().includes(search.toLowerCase()) || r.code.toLowerCase().includes(search.toLowerCase()))
      )
    : [];

  const allFiltered = search
    ? formRecords.filter(r => [r.enumerator, r.code, r.municipality, r.supervisor].some(v => v.toLowerCase().includes(search.toLowerCase())))
    : formRecords;

  const grandTotals = {
    totalFilled: formRecords.reduce((s, r) => s + r.totalFilled, 0),
    transferred: formRecords.reduce((s, r) => s + r.transferredToSupervisor, 0),
    checked: formRecords.reduce((s, r) => s + r.checkedBySupervisor, 0),
    toDistrict: formRecords.reduce((s, r) => s + r.transferredToDistrict, 0),
  };

  const filteredDriveFiles = driveFiles.filter(f => {
    const matchFilter = driveFilter === 'all' || f.type === driveFilter || (driveFilter === 'drive' && f.savedToDrive) || (driveFilter === 'local' && !f.savedToDrive);
    const matchSearch = !driveSearch || f.name.toLowerCase().includes(driveSearch.toLowerCase()) || f.originalName?.toLowerCase().includes(driveSearch.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ─── Effects ──────────────────────────────────────────────────
  useEffect(() => { localStorage.setItem(STORAGE_KEY, JSON.stringify(formRecords)); }, [formRecords]);

  useEffect(() => {
    const handleShowModal = () => setShowAttendanceModal(true);
    window.addEventListener('showAttendanceModal', handleShowModal);
    return () => window.removeEventListener('showAttendanceModal', handleShowModal);
  }, []);

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) {
      const userData = JSON.parse(u);
      setUser(userData);
      setWorkEntries(JSON.parse(localStorage.getItem(`workData_${userData.id}`) || '[]'));
      
      // Load attendance from localStorage first, then sync from MongoDB
      const localAttendance = JSON.parse(localStorage.getItem(`attendance_${userData.id}`) || '[]');
      setAttendanceRecords(localAttendance);
      
      // Sync with MongoDB
      loadAttendanceFromMongo(userData.id).then(mongoData => {
        if (mongoData && mongoData.length > 0) {
          setAttendanceRecords(mongoData);
        }
      });
      
      setDocuments(JSON.parse(localStorage.getItem(`documents_${userData.id}`) || '[]'));
      setDriveFiles(JSON.parse(localStorage.getItem(`driveFiles_${userData.id}`) || '[]'));
      const raw = localStorage.getItem('notices');
      setNotices(raw ? JSON.parse(raw).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : []);
      const tc = localStorage.getItem('tokenCounter');
      if (tc) setTokenCounter(parseInt(tc));
    }
    if (localStorage.getItem('darkMode') === 'true') { setDarkMode(true); document.body.classList.add('dark-mode'); }
  }, []);

  useEffect(() => {
    if (user) { loadNotifications(); const iv = setInterval(loadNotifications, 30000); return () => clearInterval(iv); }
  }, [user, loadNotifications]);

  useEffect(() => {
    if (darkMode) { document.body.classList.add('dark-mode'); localStorage.setItem('darkMode', 'true'); }
    else { document.body.classList.remove('dark-mode'); localStorage.setItem('darkMode', 'false'); }
  }, [darkMode]);

  useEffect(() => () => { if (watchId) navigator.geolocation.clearWatch(watchId); }, [watchId]);

  if (!user) return null;

  const filteredEntries = filterDate ? workEntries.filter(e => e.date === filterDate) : workEntries;
  const { date: todayDate } = getNepalTimeComponents();
  const todayRecord = attendanceRecords.find(r => r.date === todayDate);
  const hasCheckIn = !!todayRecord?.checkIn;
  const hasCheckOut = !!todayRecord?.checkOut;
  const canCheckinNow = canCheckin();
  const canCheckoutNow = canCheckout();
  const checkinMsg = getCheckinTimeMessage();
  const checkoutMsg = getCheckoutTimeMessage();

  const submitPct = submitProgress.total > 0 ? Math.round((submitProgress.current / submitProgress.total) * 100) : 0;

  return (
    <div className={`staff-dashboard ${darkMode ? 'dark' : ''}`}>

      <div className="top-nav-bar">
        <div className="top-nav-left">
          <div className="nav-logo">
            <span className="nav-logo-icon">🏛️</span>
            <div>
              <div className="nav-brand">DECO Dolakha</div>
              <div className="nav-sub">Census 2082</div>
            </div>
          </div>
          <nav className="main-tabs">
            {[
              { id: 'dashboard', label: '📊 Dashboard' },
              { id: 'census', label: '📋 Census' },
              { id: 'attendance', label: '📍 Attendance' },
              { id: 'documents', label: '☁️ Drive' },
              { id: 'forms', label: '📁 Forms' },
            ].map(tab => (
              <button
                key={tab.id}
                className={`main-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="top-nav-right">
          <button className="theme-toggle" onClick={() => setDarkMode(d => !d)} title="Toggle theme">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="notif-bell" onClick={() => setShowNotifications(!showNotifications)}>
            🔔 {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
          </div>
          <div className="user-chip">
            <span className="user-avatar">{user?.name?.[0] || '?'}</span>
            <span className="user-name-chip">{user?.name}</span>
            <span className="user-id-chip">{user?.id}</span>
          </div>
        </div>
      </div>

      {showNotifications && (
        <div className="notif-dropdown">
          <div className="notif-header">
            <h3>🔔 Notifications</h3>
            <span className="notif-close" onClick={() => setShowNotifications(false)}>✕</span>
          </div>
          {notifications.length === 0
            ? <div className="no-notifications">No notifications</div>
            : notifications.map(n => (
              <div key={n.id} className={`notif-item ${!n.read ? 'unread' : ''}`} onClick={() => markAsRead(n.id)}>
                <div className="notif-title">{n.title}</div>
                <div className="notif-msg">{n.message}</div>
                <div className="notif-time">{new Date(n.timestamp).toLocaleString()}</div>
              </div>
            ))}
        </div>
      )}

      <div className={`backend-banner ${backendOnline ? 'online' : 'offline'}`}>
        <div className="backend-banner-left">
          <div className="backend-icon-big">{backendOnline ? '✅' : '⚠️'}</div>
          <div>
            <div className="backend-status-text">
              {backendOnline
                ? `Google Drive Connected — ${OWNER_EMAIL}`
                : 'Backend Offline — run: node server.js to enable Drive uploads'}
            </div>
            <div className="backend-sub">
              {backendOnline
                ? `Auto-uploading to: ${DRIVE_FOLDER_NAME}/ · Format: YYYY-MM-DD_HH-MM-SS_EmpID_File`
                : driveStatusMsg || 'Start Node.js backend to enable Google Drive uploads'}
            </div>
            {driveError && <div className="drive-error-inline">❌ {driveError}</div>}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="upload-progress-wrap">
                {Object.keys(uploadProgress).map(name => (
                  <div key={name} className="upload-progress-item">
                    <div className="upload-prog-label">⬆️ {name.slice(0, 50)}...</div>
                    <div className="upload-prog-bar"><div className="upload-prog-fill" /></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="backend-btn-group">
          {backendOnline && (
            <>
              <button className="backend-btn modal-btn" onClick={() => setShowDriveModal(v => !v)}>
                📋 Files ({driveFiles.length})
              </button>
              <button className="backend-btn panel" onClick={() => setShowDrivePanel(v => !v)}>
                📂 {showDrivePanel ? 'Hide Log' : 'Upload Log'} ({driveRecords.length})
              </button>
            </>
          )}
        </div>
      </div>

      {showDrivePanel && (
        <div className="drive-panel">
          <div className="drive-panel-header">
            <div>
              <div className="drive-panel-title">📂 Upload Log — {DRIVE_FOLDER_NAME}</div>
              <div className="drive-panel-sub">
                {driveRecords.length} total · {driveRecords.filter(r => r.savedToDrive).length} on Drive · {driveRecords.filter(r => !r.savedToDrive).length} local only
              </div>
            </div>
            <button className="drive-btn disconnect" onClick={() => {
              if (window.confirm('Clear local upload log? (Does not delete files from Drive)')) {
                setDriveRecords([]); localStorage.removeItem(DRIVE_RECORDS_KEY);
              }
            }}>🗑️ Clear Log</button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            {driveRecords.length === 0 ? (
              <div className="drive-empty">No uploads yet. Files appear here after upload.</div>
            ) : (
              <table className="drive-rec-table">
                <thead>
                  <tr><th>Standard Filename</th><th>Original Name</th><th>Employee</th><th>Type</th><th>Date & Time</th><th>Status</th><th>Link</th><th>Del</th></tr>
                </thead>
                <tbody>
                  {driveRecords.map(rec => (
                    <tr key={rec.id}>
                      <td className="drive-name-cell">{rec.standardName}</td>
                      <td className="drive-orig-cell">{rec.originalName}</td>
                      <td><span className="code-badge">{rec.employeeId}</span></td>
                      <td><span className="fname-badge">{rec.fileType}</span></td>
                      <td style={{ fontSize: '.68rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>{new Date(rec.uploadedAt).toLocaleString()}</td>
                      <td>{rec.savedToDrive ? <span className="drive-saved-badge">✅ Drive</span> : <span className="drive-local-badge">💾 Local</span>}</td>
                      <td>{rec.driveLink ? <a href={rec.driveLink} target="_blank" rel="noreferrer" className="drive-link-btn">🔗 Open</a> : <span style={{ color: 'var(--muted)', fontSize: '.68rem' }}>—</span>}</td>
                      <td><button className="drive-del-btn-sm" onClick={() => deleteFromDrive(rec.id, rec.driveId)}>🗑️</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {isTracking && liveLocation && (
        <div className="live-track-bar">
          <span className="live-dot"></span>
          Live Tracking &nbsp;·&nbsp;
          <span>📍 {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}</span>
          <span>🎯 ±{Math.round(liveLocation.accuracy)}m</span>
        </div>
      )}

      {activeTab === 'dashboard' && (
        <>
          <div className="attendance-action-bar">
            <div className="attendance-status">
              <div className="status-indicator">
                <span className={`status-dot ${hasCheckIn ? (hasCheckOut ? 'completed' : 'checked-in') : 'pending'}`}></span>
                <span className="status-text">{hasCheckOut ? '✅ Completed' : (hasCheckIn ? '🟢 Checked In' : '🔴 Not Checked In')}</span>
              </div>
              {todayRecord && (
                <div className="status-details">
                  {todayRecord.checkIn && <span>Check-in: {todayRecord.checkIn} NPT</span>}
                  {todayRecord.checkOut && <span>Check-out: {todayRecord.checkOut} NPT</span>}
                  {todayRecord.locationPlaceName && <span className="location-badge" title={todayRecord.locationPlaceName}>📍 {todayRecord.locationPlaceName.substring(0, 40)}</span>}
                </div>
              )}
            </div>
            <div className="attendance-actions">
              <button
                className={`attendance-btn checkin ${hasCheckIn ? 'disabled' : ''}`}
                onClick={quickCheckIn}
                disabled={hasCheckIn}
                title={checkinMsg || (canCheckinNow ? 'Check-in available (8:00-9:00 AM NPT)' : 'Check-in not available')}
              >
                📍 Check In (8-9 AM NPT)
              </button>
              <button
                className={`attendance-btn checkout ${!hasCheckIn || hasCheckOut ? 'disabled' : ''}`}
                onClick={quickCheckOut}
                disabled={!hasCheckIn || hasCheckOut}
                title={checkoutMsg || (canCheckoutNow ? 'Check-out available (5:00-6:00 PM NPT)' : 'Check-out not available')}
              >
                🏁 Check Out (5-6 PM NPT)
              </button>
              <button className="attendance-btn password" onClick={() => setShowChangePassword(true)}>🔐 Password</button>
            </div>
          </div>

          <div className="notices-section">
            <h3>📢 Official Notices</h3>
            {notices.length === 0
              ? <p className="no-data">No notices</p>
              : notices.map(n => (
                <div key={n.id} className={`notice-card notice-${n.priority}`}>
                  <div className="notice-head"><span className="notice-title">{n.title}</span><span className="notice-date">{new Date(n.createdAt).toLocaleDateString()}</span></div>
                  <div className="notice-content">{n.content}</div>
                </div>
              ))}
          </div>

          <div className="about-section">
            <div className="about-header"><span className="about-icon">🏛️</span><h2>About District Economic Census Office, Dolakha</h2></div>
            <div className="about-grid">
              <div>
                <p>The <strong>District Economic Census Office, Dolakha</strong> operates under the <strong>National Statistics Office (NSO)</strong>, Government of Nepal. Our mission is to conduct the <strong>National Economic Census 2082</strong> with precision, transparency, and technological excellence.</p>
                <p>Covering <strong>9 municipalities</strong> including Bhimeshwar, Kalinchok, Gaurishankar, Jiri, Tamakoshi, Bigu, Melung, Baiteshwar, and Shailung.</p>
              </div>
              <div>
                <div className="objective-card">
                  <div className="objective-title">🎯 CORE OBJECTIVES</div>
                  <ul>
                    <li>Complete enumeration of economic establishments</li>
                    <li>Generate reliable e-Census tokens for verification</li>
                    <li>GPS-based staff attendance tracking (8-9 AM Check-in, 5-6 PM Check-out)</li>
                    <li>Real-time data analytics to administration</li>
                    <li>Transparent and secure data archive</li>
                    <li><strong>☁️ Auto Google Drive backup via service account</strong></li>
                  </ul>
                </div>
                <div className="stats-mini">
                  <div className="stat-mini"><span className="stat-mini-number">9</span><span className="stat-mini-label">MUNICIPALITIES</span></div>
                  <div className="stat-mini"><span className="stat-mini-number">40+</span><span className="stat-mini-label">ENUMERATORS</span></div>
                  <div className="stat-mini"><span className="stat-mini-number">100%</span><span className="stat-mini-label">DIGITAL</span></div>
                </div>
              </div>
            </div>
            <div className="about-footer"><span>📞 DECO Dolakha | 📧 {OWNER_EMAIL} | 📍 District Administration Office Complex, Dolakha</span></div>
          </div>

          <div className="stats-grid">
            {[
              { icon: '📊', label: 'Total Census Count', value: workEntries.reduce((s, e) => s + (parseInt(e.totalCount) || 0), 0).toLocaleString(), color: 'blue' },
              { icon: '🎫', label: 'Tokens Issued', value: workEntries.filter(e => e.censusToken).length, color: 'green' },
              { icon: '📄', label: 'Documents Uploaded', value: documents.length, color: 'amber' },
              { icon: '☁️', label: 'Files on Drive', value: driveFiles.filter(f => f.savedToDrive).length, color: 'blue' },
              { icon: '📈', label: 'Attendance Rate', value: attendanceRecords.length > 0 ? `${((attendanceRecords.filter(r => r.status === 'Present').length / attendanceRecords.length) * 100).toFixed(0)}%` : '0%', color: 'green' },
            ].map((s, i) => (
              <div key={i} className={`stat-card stat-${s.color}`}>
                <span className="stat-icon">{s.icon}</span>
                <div><div className="stat-label">{s.label}</div><div className="stat-value">{s.value}</div></div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'census' && (
        <>
          <div className="tab-section-header">
            <h2>📋 Census Data Collection</h2>
            <div className="tab-header-actions">
              <div className="view-toggle">
                <button className={entryViewMode === 'table' ? 'active' : ''} onClick={() => setEntryViewMode('table')}>☰ Table</button>
                <button className={entryViewMode === 'cards' ? 'active' : ''} onClick={() => setEntryViewMode('cards')}>⊞ Cards</button>
              </div>
              <div className="filter-group">
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} className="filter-date" />
                {filterDate && <button className="clear-btn" onClick={() => setFilterDate('')}>✕</button>}
              </div>
              <button className="add-btn-main" onClick={() => {
                resetForm();
                setShowForm(true);
              }}>
                + Add Census Entry
              </button>
            </div>
          </div>

          {entryViewMode === 'table' ? (
            <div className="table-section">
              <div className="table-responsive">
                <table className="data-table">
                  <thead><tr><th>Date</th><th>Total Count</th><th>Census Token</th><th>Hours</th><th>Status</th><th>Photo</th><th>Drive Files</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredEntries.length === 0
                      ? <tr><td colSpan="8" className="no-data">No census entries found</td></tr>
                      : filteredEntries.map(entry => (
                        <tr key={entry.id}>
                          <td><span className="date-badge">{entry.date}</span></td>
                          <td><strong>{entry.totalCount?.toLocaleString()}</strong></td>
                          <td><span className="token-badge">{entry.censusToken}</span></td>
                          <td>{entry.hoursWorked}h</td>
                          <td><span className={`sbadge ${entry.status}`}>{entry.status}</span></td>
                          <td>{entry.hasPhoto ? <span className="photo-icon">📸</span> : '—'}</td>
                          <td>{entry.driveFileIds?.length > 0 ? <span className="drive-count-chip">☁️ {entry.driveFileIds.length}</span> : '—'}</td>
                          <td>
                            <button onClick={() => handleEditEntry(entry)} className="action-btn edit">✏️</button>
                            <button onClick={() => handleDeleteEntry(entry.id)} className="action-btn delete">🗑️</button>
                           </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="entry-cards-grid">
              {filteredEntries.length === 0
                ? <div className="no-data" style={{ gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>No census entries found</div>
                : filteredEntries.map(entry => (
                  <div key={entry.id} className="entry-card">
                    <div className="entry-card-header">
                      <span className="date-badge">{entry.date}</span>
                      <span className={`sbadge ${entry.status}`}>{entry.status}</span>
                    </div>
                    <div className="entry-card-count">{entry.totalCount?.toLocaleString()}</div>
                    <div className="entry-card-label">Census Count</div>
                    <div className="entry-card-meta">
                      <span>🎫 {entry.censusToken}</span>
                      <span>⏱️ {entry.hoursWorked}h</span>
                      {entry.hasPhoto && <span>📸 Photo</span>}
                      {entry.driveFileIds?.length > 0 && <span>☁️ {entry.driveFileIds.length} files</span>}
                    </div>
                    {entry.description && <div className="entry-card-desc">{entry.description}</div>}
                    <div className="entry-card-actions">
                      <button onClick={() => handleEditEntry(entry)} className="action-btn edit">✏️ Edit</button>
                      <button onClick={() => handleDeleteEntry(entry.id)} className="action-btn delete">🗑️ Delete</button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </>
      )}

      {activeTab === 'attendance' && (
        <>
          <div className="tab-section-header">
            <h2>📍 Attendance Records (Nepal Time UTC+5:45)</h2>
            <div className="tab-header-actions">
              <button
                className="add-btn-main checkin-btn"
                onClick={quickCheckIn}
                disabled={hasCheckIn}
                title={checkinMsg || (canCheckinNow ? 'Check-in available 8:00-9:00 AM NPT' : 'Check-in not available')}
              >
                📍 Check In (8-9 AM)
              </button>
              <button
                className="add-btn-main checkout-btn"
                onClick={quickCheckOut}
                disabled={!hasCheckIn || hasCheckOut}
                title={checkoutMsg || (canCheckoutNow ? 'Check-out available 5:00-6:00 PM NPT' : 'Check-out not available')}
              >
                🏁 Check Out (5-6 PM)
              </button>
            </div>
          </div>
          <div className="attendance-info-banner" style={{ backgroundColor: darkMode ? '#1f2937' : '#e0e7ff', padding: '10px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '13px' }}>
            <span>🕐 <strong>Nepal Time (UTC+5:45)</strong> — Check-in: 8:00-9:00 AM | Check-out: 5:00-6:00 PM</span>
            {checkinMsg && !hasCheckIn && <span style={{ marginLeft: '16px', color: '#f59e0b' }}>⏰ {checkinMsg}</span>}
            {checkoutMsg && hasCheckIn && !hasCheckOut && <span style={{ marginLeft: '16px', color: '#f59e0b' }}>⏰ {checkoutMsg}</span>}
          </div>
          <div className="table-section">
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr><th>Date</th><th>Check In (NPT)</th><th>Check Out (NPT)</th><th>Status</th><th>Location</th><th>Coordinates</th></tr>
                </thead>
                <tbody>
                  {attendanceRecords.length === 0
                    ? <tr><td colSpan="6" className="no-data">No attendance records</td></tr>
                    : [...attendanceRecords].reverse().map(att => (
                      <tr key={att.id}>
                        <td><span className="date-badge">{att.date}</span></td>
                        <td>{att.checkIn || '—'}</td>
                        <td>{att.checkOut || '—'}</td>
                        <td><span className={`sbadge ${att.status === 'Present' ? 'completed' : att.status === 'Half Day' ? 'pending' : 'absent'}`}>{att.status || '—'}</span></td>
                        <td title={att.locationPlaceName}>{att.locationPlaceName ? att.locationPlaceName.substring(0, 35) + (att.locationPlaceName.length > 35 ? '...' : '') : '—'}</td>
                        <td>{att.location ? `${att.location.lat.toFixed(4)}, ${att.location.lng.toFixed(4)}` : '—'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'documents' && (
        <>
          <div className="tab-section-header">
            <h2>☁️ Google Drive Files</h2>
            <div className="tab-header-actions">
              <input
                className="drive-search-input"
                placeholder="🔍 Search files..."
                value={driveSearch}
                onChange={e => setDriveSearch(e.target.value)}
              />
              <div className="drive-filter-tabs">
                {['all','pdf','image','docs','excel','drive','local'].map(f => (
                  <button key={f} className={driveFilter === f ? 'active' : ''} onClick={() => setDriveFilter(f)}>
                    {f === 'all' ? '🗂️ All' : f === 'drive' ? '✅ Drive' : f === 'local' ? '💾 Local' : fileTypeLabel[f] || f}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="drive-stats-bar">
            <div className="dstat"><span className="dstat-num">{driveFiles.length}</span><span className="dstat-lbl">Total Files</span></div>
            <div className="dstat"><span className="dstat-num" style={{ color: '#22c55e' }}>{driveFiles.filter(f => f.savedToDrive).length}</span><span className="dstat-lbl">On Drive</span></div>
            <div className="dstat"><span className="dstat-num" style={{ color: '#f59e0b' }}>{driveFiles.filter(f => !f.savedToDrive).length}</span><span className="dstat-lbl">Local Only</span></div>
            <div className="dstat"><span className="dstat-num">{formatFileSize(driveFiles.reduce((s, f) => s + (f.size || 0), 0))}</span><span className="dstat-lbl">Total Size</span></div>
          </div>

          <div className="drive-section">
            {filteredDriveFiles.length === 0 ? (
              <div className="empty-drive-state">
                <div className="empty-drive-icon">☁️</div>
                <div className="empty-drive-title">No files {driveSearch ? 'matching search' : 'yet'}</div>
                <div className="empty-drive-sub">Upload files via census entries — they auto-save to Google Drive</div>
              </div>
            ) : (
              <div className="drive-grid">
                {filteredDriveFiles.map(f => (
                  <div key={f.id} className={`drive-card ${f.savedToDrive ? 'saved' : 'local-only'}`}>
                    <div className="drive-card-icon">{getFileIcon(f.type, f.mimeType)}</div>
                    <div className="drive-info">
                      <div className="drive-name">{f.name}</div>
                      {f.originalName && f.originalName !== f.name && <div className="drive-orig">Original: {f.originalName}</div>}
                      <div className="drive-meta">
                        <span>📅 {f.uploadDateFormatted || new Date(f.uploadDate).toLocaleDateString('en-GB')}</span>
                        <span>⏱️ {f.uploadTime || new Date(f.uploadDate).toLocaleTimeString('en-GB')}</span>
                        {f.size > 0 && <span>📏 {formatFileSize(f.size)}</span>}
                        <span className={`drive-status-chip ${f.savedToDrive ? 'saved' : 'local'}`}>{f.savedToDrive ? '✅ Drive' : '💾 Local'}</span>
                      </div>
                      <div className="drive-actions">
                        {f.webViewLink && <button className="drive-view" onClick={() => openInDrive(f.webViewLink)}>👁️ Open in Drive</button>}
                        <button className="drive-delete" onClick={() => deleteFromDrive(f.id, f.driveId)}>🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="docs-section">
            <div className="docs-header"><h3>📄 Local Backup ({documents.length})</h3></div>
            {documents.length === 0 ? (
              <p className="no-data">No local documents.</p>
            ) : (
              <div className="docs-grid">
                {documents.map(doc => (
                  <div key={doc.id} className="doc-card">
                    <div className="doc-icon-big">{getFileIcon(doc.type, doc.mimeType)}</div>
                    <div style={{ flex: 1 }}>
                      <div className="doc-name" title={doc.name}>{doc.name}</div>
                      {doc.originalName && doc.originalName !== doc.name && <div className="doc-type" style={{ fontSize: '.65rem', color: 'var(--muted)' }}>Original: {doc.originalName}</div>}
                      <div className="doc-type">{doc.type}</div>
                      <div className="doc-desc">{doc.description}</div>
                      <div className="doc-date">{new Date(doc.uploadDate).toLocaleDateString()}</div>
                      {doc.savedToDrive && <div style={{ fontSize: '.65rem', color: '#22c55e', marginBottom: 4 }}>✅ Also on Google Drive</div>}
                      <div className="doc-acts">
                        {doc.driveLink && <a href={doc.driveLink} target="_blank" rel="noreferrer" className="dl-link" style={{ marginRight: 4 }}>🔗 Drive</a>}
                        {doc.data && <a href={doc.data} download={doc.name} className="dl-link">📥</a>}
                        <button onClick={() => deleteDocument(doc.id)} className="del-btn">🗑️</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {activeTab === 'forms' && (
        <div className="frm-container">
          <div className="frm-header">
            <div className="frm-title">
              <div className="frm-logo">📁</div>
              <div><h2>Form Record Management</h2><p>National Economic Census 2082 · District Office, Dolakha</p></div>
            </div>
            <div className="frm-nav">
              <button className={frmView === 'folders' ? 'active' : ''} onClick={() => { setFrmView('folders'); setSelectedMunicipality(null); }}>📂 Folders</button>
              <button className={frmView === 'table' ? 'active' : ''} onClick={() => setFrmView('table')}>📋 All Records</button>
              <button className={frmView === 'stats' ? 'active' : ''} onClick={() => setFrmView('stats')}>📊 By Municipality</button>
            </div>
          </div>

          <div className="frm-summary">
            <div className="sum-card"><div className="sum-label">Enumerators</div><div className="sum-val blue">{formRecords.length}</div></div>
            <div className="sum-card"><div className="sum-label">Forms Filled</div><div className="sum-val green">{grandTotals.totalFilled.toLocaleString()}</div></div>
            <div className="sum-card"><div className="sum-label">To Supervisor</div><div className="sum-val amber">{grandTotals.transferred.toLocaleString()}</div></div>
            <div className="sum-card"><div className="sum-label">Checked</div><div className="sum-val blue">{grandTotals.checked.toLocaleString()}</div></div>
            <div className="sum-card"><div className="sum-label">To District</div><div className="sum-val green">{grandTotals.toDistrict.toLocaleString()}</div></div>
            <div className="sum-card"><div className="sum-label">Municipalities</div><div className="sum-val amber">{MUNICIPALITIES.length}</div></div>
          </div>

          <div className="frm-bar">
            <input className="frm-search" placeholder="🔍 Search enumerator, code, municipality..." value={search} onChange={e => setSearch(e.target.value)} />
            <button className="btn-add" onClick={frmOpenAdd}>＋ Add Record</button>
          </div>

          {frmView === 'folders' && !selectedMunicipality && (
            <div className="folder-grid">
              {folderGroups.filter(g => g.count > 0).map(g => (
                <div key={g.mun} className="folder-card" onClick={() => { setSelectedMunicipality(g.mun); setSearch(''); }}>
                  <div className="folder-count">{g.count}</div>
                  <div className="folder-icon">📂</div>
                  <div className="folder-name nep-text">{g.mun}</div>
                  <div className="folder-meta">Forms filled: {g.totalFilled} · To district: {g.totalTransferred}</div>
                  <div className="folder-progress"><div className="folder-progress-fill" style={{ width: `${pct(g.totalTransferred, g.totalFilled)}%` }} /></div>
                </div>
              ))}
            </div>
          )}

          {frmView === 'folders' && selectedMunicipality && (
            <>
              <div className="frm-bread">
                <span className="bread-link" onClick={() => setSelectedMunicipality(null)}>📂 All Folders</span>
                <span>›</span><span className="nep-text">{selectedMunicipality}</span>
              </div>
              <div className="frm-table-wrap">
                <table className="frm-table">
                  <thead><tr><th>S.N</th><th>Code</th><th>Enumerator</th><th>Supervisor</th><th>Total Filled</th><th>→ Supervisor</th><th>Remaining</th><th>Checked</th><th>→ District</th><th>Sup. Rem.</th><th>Progress</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredInFolder.length === 0
                      ? <tr><td colSpan="12"><div className="empty-msg">No records found</div></td></tr>
                      : filteredInFolder.map(r => (
                        <tr key={r.code}>
                          <td>{r.sn}</td><td><span className="code-badge">{r.code}</span></td>
                          <td className="nep-text">{r.enumerator}</td><td className="nep-text">{r.supervisor}</td>
                          <td className="num-cell">{r.totalFilled}</td><td className="num-cell">{r.transferredToSupervisor}</td>
                          <td className="num-cell">{r.remainingWithEnumerator}</td><td className="num-cell">{r.checkedBySupervisor}</td>
                          <td className="num-cell">{r.transferredToDistrict}</td><td className="num-cell">{r.remainingWithSupervisor}</td>
                          <td><div className="prog-wrap"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct(r.transferredToDistrict, r.totalFilled)}%` }} /></div><span className="prog-pct">{pct(r.transferredToDistrict, r.totalFilled)}%</span></div></td>
                          <td><div className="action-row"><button className="btn-edit" onClick={() => frmOpenEdit(r)}>✏️</button><button className="btn-del" onClick={() => setConfirmDelete(r.code)}>🗑️</button></div></td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {frmView === 'table' && (
            <div className="frm-table-wrap">
              <table className="frm-table">
                <thead><tr><th>S.N</th><th>Code</th><th>Enumerator</th><th>Supervisor</th><th>Municipality</th><th>Filled</th><th>→ Sup</th><th>Remaining</th><th>Checked</th><th>→ District</th><th>Sup. Rem.</th><th>Progress</th><th>Actions</th></tr></thead>
                <tbody>
                  {allFiltered.length === 0
                    ? <tr><td colSpan="13"><div className="empty-msg">No records match</div></td></tr>
                    : allFiltered.map(r => (
                      <tr key={r.code}>
                        <td>{r.sn}</td><td><span className="code-badge">{r.code}</span></td>
                        <td className="nep-text">{r.enumerator}</td><td className="nep-text">{r.supervisor}</td><td className="nep-text">{r.municipality}</td>
                        <td className="num-cell">{r.totalFilled}</td><td className="num-cell">{r.transferredToSupervisor}</td>
                        <td className="num-cell">{r.remainingWithEnumerator}</td><td className="num-cell">{r.checkedBySupervisor}</td>
                        <td className="num-cell">{r.transferredToDistrict}</td><td className="num-cell">{r.remainingWithSupervisor}</td>
                        <td><div className="prog-wrap"><div className="prog-bar"><div className="prog-fill" style={{ width: `${pct(r.transferredToDistrict, r.totalFilled)}%` }} /></div><span className="prog-pct">{pct(r.transferredToDistrict, r.totalFilled)}%</span></div></td>
                        <td><div className="action-row"><button className="btn-edit" onClick={() => frmOpenEdit(r)}>✏️</button><button className="btn-del" onClick={() => setConfirmDelete(r.code)}>🗑️</button></div></td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}

          {frmView === 'stats' && (
            <div className="stats-grid-frm">
              {folderGroups.map(g => (
                <div key={g.mun} className="stats-card-frm">
                  <h3>📂 <span className="nep-text">{g.mun}</span></h3>
                  {g.items.map(r => (
                    <div key={r.code} className="stats-row">
                      <span className="stats-name nep-text">{r.enumerator} <span className="code-badge" style={{ fontSize: '.65rem' }}>{r.code}</span></span>
                      <span className="stats-num">{r.totalFilled}</span>
                    </div>
                  ))}
                  <hr className="modal-divider" />
                  <div className="stats-row"><span style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 600 }}>TOTAL FILLED</span><span className="stats-num" style={{ color: '#22c55e' }}>{g.totalFilled}</span></div>
                  <div className="stats-row"><span style={{ fontSize: '.7rem', color: 'var(--muted)', fontWeight: 600 }}>TO DISTRICT</span><span className="stats-num">{g.totalTransferred}</span></div>
                  <div className="folder-progress" style={{ marginTop: 8 }}><div className="folder-progress-fill" style={{ width: `${pct(g.totalTransferred, g.totalFilled)}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => { if (!isSubmitting) { setShowForm(false); resetForm(); } }}>
          <div className="modal-box large entry-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <div>
                <h2>{editingEntry ? '✏️ Edit Census Entry' : '➕ Add New Census Entry'}</h2>
                <div className="modal-sub">{editingEntry ? `Editing entry from ${editingEntry.date}` : 'Fill in the details below — files upload directly to Google Drive'}</div>
              </div>
              {!isSubmitting && (
                <button className="modal-close-x" onClick={() => { setShowForm(false); resetForm(); }}>✕</button>
              )}
            </div>

            {!editingEntry && (
              <div className={`modal-drive-status ${backendOnline ? 'online' : 'offline'}`}>
                {backendOnline
                  ? `☁️ Files will auto-upload to Google Drive (${DRIVE_FOLDER_NAME}) — no popup, no extra clicks`
                  : '⚠️ Backend offline — files will save locally. Run: node server.js to enable Drive upload'}
              </div>
            )}

            {isSubmitting && (
              <div className="submit-progress-section">
                <div className="submit-progress-header">
                  <span className="submit-progress-label">{submitProgress.label || 'Processing...'}</span>
                  <span className="submit-progress-pct">{submitPct}%</span>
                </div>
                <div className="submit-progress-bar-outer">
                  <div className="submit-progress-bar-inner" style={{ width: `${submitPct}%` }} />
                </div>
                <div className="submit-progress-steps">
                  {submitProgress.total > 0 && (
                    <span>{submitProgress.current} of {submitProgress.total} files uploaded</span>
                  )}
                </div>
              </div>
            )}

            <form onSubmit={handleSubmitEntry} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label>📅 Date <span className="req">*</span></label>
                  <input
                    type="date"
                    value={newEntry.date}
                    onChange={e => setNewEntry({ ...newEntry, date: e.target.value })}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>🔢 Total Census Count <span className="req">*</span></label>
                  <input
                    type="number"
                    value={newEntry.totalCount}
                    onChange={e => setNewEntry({ ...newEntry, totalCount: e.target.value })}
                    placeholder="Number of households / businesses"
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>⏱️ Hours Worked <span className="req">*</span></label>
                  <input
                    type="number"
                    value={newEntry.hoursWorked}
                    onChange={e => setNewEntry({ ...newEntry, hoursWorked: e.target.value })}
                    step="0.5"
                    placeholder="Hours worked today"
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="form-group">
                  <label>📌 Status</label>
                  <select
                    value={newEntry.status}
                    onChange={e => setNewEntry({ ...newEntry, status: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>📝 Description</label>
                <textarea
                  value={newEntry.description}
                  onChange={e => setNewEntry({ ...newEntry, description: e.target.value })}
                  rows="3"
                  placeholder="Detailed description of census work done today..."
                  disabled={isSubmitting}
                />
              </div>

              <div className="form-group">
                <label>📸 Upload Photo <span className="opt-badge">Optional</span></label>
                <div className={`photo-upload-area ${isSubmitting ? 'disabled' : ''}`}>
                  {photoPreview ? (
                    <div className="photo-preview-container">
                      <img src={photoPreview} alt="Preview" className="photo-preview" />
                      <div className="photo-overlay">
                        <button
                          type="button"
                          className="remove-photo-btn"
                          onClick={() => { setSelectedPhotoFile(null); setPhotoPreview(null); setFileNamePreviews(prev => prev.filter(p => p.fileType !== 'Photo')); }}
                          disabled={isSubmitting}
                        >✕ Remove</button>
                        <button
                          type="button"
                          className="select-photo-btn"
                          onClick={() => document.getElementById(`photoUpload_${formResetKeyRef.current}`)?.click()}
                          disabled={isSubmitting}
                        >🔄 Change</button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="upload-placeholder"
                      onClick={() => !isSubmitting && document.getElementById(`photoUpload_${formResetKeyRef.current}`)?.click()}
                    >
                      <span className="upload-icon">📷</span>
                      <p>Click to select a photo</p>
                      <p className="upload-hint">JPG, PNG, GIF, WebP — max 5MB</p>
                    </div>
                  )}
                  <input
                    key={`photo_${formResetKeyRef.current}`}
                    type="file"
                    id={`photoUpload_${formResetKeyRef.current}`}
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                    onChange={handlePhotoSelect}
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              {!editingEntry && (
                <div className="form-group">
                  <label>📎 Attach Documents <span className="opt-badge">Optional</span></label>
                  <div className="file-type-tabs">
                    {Object.keys(fileTypeLabel).map(ft => (
                      <button
                        key={ft}
                        type="button"
                        className={`ft-tab ${pendingFileType === ft ? 'active' : ''}`}
                        onClick={() => !isSubmitting && setPendingFileType(ft)}
                        disabled={isSubmitting}
                      >{fileTypeLabel[ft]}</button>
                    ))}
                  </div>
                  <input
                    key={`entryFile_${formResetKeyRef.current}`}
                    type="file"
                    id={`entryFile_${formResetKeyRef.current}`}
                    accept={fileTypeAccept[pendingFileType]}
                    style={{ display: 'none' }}
                    onChange={handlePendingFileSelect}
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    className="attach-doc-btn"
                    onClick={() => !isSubmitting && document.getElementById(`entryFile_${formResetKeyRef.current}`)?.click()}
                    disabled={isSubmitting}
                  >
                    📁 Select {fileTypeLabel[pendingFileType]} File
                  </button>

                  {pendingEntryFiles.length > 0 && (
                    <div className="attached-files">
                      {pendingEntryFiles.map((pf, i) => (
                        <div key={i} className="attached-file-chip">
                          <span>{getFileIcon(pf.type)} {pf.file.name.slice(0, 28)}{pf.file.name.length > 28 ? '…' : ''}</span>
                          <span className="afc-size">{formatFileSize(pf.file.size)}</span>
                          <button
                            type="button"
                            className="afc-del"
                            disabled={isSubmitting}
                            onClick={() => {
                              setPendingEntryFiles(prev => prev.filter((_, idx) => idx !== i));
                              setFileNamePreviews(prev => prev.filter(p => p.originalName !== pf.file.name));
                            }}
                          >✕</button>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="file-hint">
                    Files auto-renamed → {backendOnline ? `Drive (${DRIVE_FOLDER_NAME}) + local backup` : 'local backup (run server.js to enable Drive)'}
                  </p>
                </div>
              )}

              {fileNamePreviews.length > 0 && (
                <div className="filename-preview-box">
                  <div className="filename-preview-title">📋 How Your Files Will Be Saved</div>
                  {fileNamePreviews.map((fp, i) => (
                    <div key={i} className="filename-preview-row">
                      <span className="fname-badge">{fp.fileType}</span>
                      <span className="fname-original">{fp.originalName}</span>
                      <span className="fname-arrow">→</span>
                      <span className="fname-standard">{fp.standardName}</span>
                    </div>
                  ))}
                  <div className="fname-format-note">
                    Format: YYYY-MM-DD_HH-MM-SS_{user.id}_FileName.ext
                    &nbsp;·&nbsp;
                    {backendOnline ? '☁️ Will upload to Google Drive' : '💾 Local save only'}
                  </div>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="submit"
                  className={`btn-primary submit-btn ${isSubmitting ? 'submitting' : ''}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="btn-spinner-wrap">
                      <span className="btn-spinner" />
                      {submitProgress.label || 'Uploading...'}
                    </span>
                  ) : (
                    editingEntry ? '💾 Update Entry' : '🚀 Add Entry & Upload Files'
                  )}
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => { if (!isSubmitting) { setShowForm(false); resetForm(); } }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDriveModal && (
        <div className="modal-overlay" onClick={() => setShowDriveModal(false)}>
          <div className="modal-box large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>☁️ Google Drive File Manager</h3>
              <button className="modal-close-x" onClick={() => setShowDriveModal(false)}>✕</button>
            </div>
            <div className="drive-stats-info">
              <span>Total: {driveFiles.length}</span>
              <span>On Drive: {driveFiles.filter(f => f.savedToDrive).length}</span>
              <span>Local only: {driveFiles.filter(f => !f.savedToDrive).length}</span>
              <span>Size: {formatFileSize(driveFiles.reduce((s, f) => s + (f.size || 0), 0))}</span>
            </div>
            {driveFiles.length === 0 ? (
              <p className="no-data">No files yet. Upload via census entries.</p>
            ) : (
              <div className="drive-modal-list">
                {driveFiles.map(f => (
                  <div key={f.id} className="drive-modal-item">
                    <div className="drive-modal-icon">{getFileIcon(f.type, f.mimeType)}</div>
                    <div className="drive-modal-details">
                      <div className="drive-modal-name">{f.name}</div>
                      {f.originalName && f.originalName !== f.name && <div style={{ fontSize: '.65rem', color: 'var(--muted)', marginBottom: 2 }}>Original: {f.originalName}</div>}
                      <div className="drive-modal-meta">
                        📅 {f.uploadDateFormatted || new Date(f.uploadDate).toLocaleDateString('en-GB')} &nbsp;|&nbsp;
                        ⏱️ {f.uploadTime || new Date(f.uploadDate).toLocaleTimeString('en-GB')} &nbsp;|&nbsp;
                        {f.size > 0 && `📏 ${formatFileSize(f.size)}`} &nbsp;|&nbsp;
                        <span className={`drive-status-chip ${f.savedToDrive ? 'saved' : 'local'}`}>{f.savedToDrive ? '✅ Drive' : '💾 Local'}</span>
                      </div>
                      <div className="drive-modal-actions">
                        {f.webViewLink && <button className="drive-view-btn" onClick={() => openInDrive(f.webViewLink)}>👁️ Open in Drive</button>}
                        <button className="drive-delete-btn" onClick={() => deleteFromDrive(f.id, f.driveId)}>🗑️ Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="modal-actions"><button className="btn-secondary" onClick={() => setShowDriveModal(false)}>Close</button></div>
          </div>
        </div>
      )}

      {showChangePassword && (
        <div className="modal-overlay" onClick={() => setShowChangePassword(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>🔐 Change Password</h3>
              <button className="modal-close-x" onClick={() => setShowChangePassword(false)}>✕</button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label>Current Password</label>
                <div className="pwd-wrap">
                  <input type={showCurrentPwd ? 'text' : 'password'} value={passwordChangeData.currentPassword} onChange={e => setPasswordChangeData({ ...passwordChangeData, currentPassword: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowCurrentPwd(!showCurrentPwd)}>{showCurrentPwd ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>New Password (min 6 chars)</label>
                <div className="pwd-wrap">
                  <input type={showNewPwd ? 'text' : 'password'} value={passwordChangeData.newPassword} onChange={e => setPasswordChangeData({ ...passwordChangeData, newPassword: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowNewPwd(!showNewPwd)}>{showNewPwd ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <div className="pwd-wrap">
                  <input type={showConfirmPwd ? 'text' : 'password'} value={passwordChangeData.confirmPassword} onChange={e => setPasswordChangeData({ ...passwordChangeData, confirmPassword: e.target.value })} required />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirmPwd(!showConfirmPwd)}>{showConfirmPwd ? '🙈' : '👁️'}</button>
                </div>
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn-primary">Update Password</button>
                <button type="button" className="btn-secondary" onClick={() => setShowChangePassword(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTokenModal && (
        <div className="modal-overlay" onClick={() => setShowTokenModal(false)}>
          <div className="modal-box token-modal-box" onClick={e => e.stopPropagation()}>
            <div className="token-box">
              <div className="token-icon-big">🎫</div>
              <h3>Census Token Generated</h3>
              <div className="token-code">{generatedToken}</div>
              <p className="token-note">Keep this token safe — it verifies your census submission.</p>
              <button className="btn-primary" onClick={() => setShowTokenModal(false)}>✅ Got it</button>
            </div>
          </div>
        </div>
      )}

      {editModal && (
        <div className="modal-overlay" onClick={() => setEditModal(null)}>
          <div className="modal-box-frm" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h2>{editModal.isNew ? '➕ Add New Enumerator Record' : `✏️ Edit: ${editForm.enumerator}`}</h2>
              <button className="modal-close-x" onClick={() => setEditModal(null)}>✕</button>
            </div>
            <div className="form-grid">
              <div className="form-group"><label>S.N</label><input type="number" value={editForm.sn} onChange={e => ef('sn', e.target.value)} /></div>
              <div className="form-group"><label>Code (ग.स.न.)</label><input value={editForm.code} onChange={e => ef('code', e.target.value)} placeholder="E01" /></div>
              <div className="form-group full"><label>Enumerator Name (गणक)</label><input value={editForm.enumerator} onChange={e => ef('enumerator', e.target.value)} placeholder="गणकको नाम" /></div>
              <div className="form-group">
                <label>Supervisor</label>
                <select value={editForm.supervisor} onChange={e => ef('supervisor', e.target.value)}>
                  <option value="">— Select Supervisor —</option>
                  {SUPERVISORS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="__custom__">Other...</option>
                </select>
              </div>
              {editForm.supervisor === '__custom__' && <div className="form-group"><label>Supervisor Name</label><input value="" onChange={e => ef('supervisor', e.target.value)} placeholder="नाम लेख्नुस्" /></div>}
              <div className="form-group">
                <label>Municipality (स्थानिय तह)</label>
                <select value={editForm.municipality} onChange={e => ef('municipality', e.target.value)}>
                  <option value="">— Select —</option>
                  {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <hr className="modal-divider" style={{ gridColumn: '1/-1' }} />
              <div className="form-group"><label>Total Forms Filled</label><input type="number" min="0" value={editForm.totalFilled} onChange={e => ef('totalFilled', e.target.value)} /></div>
              <div className="form-group"><label>Transferred to Supervisor</label><input type="number" min="0" value={editForm.transferredToSupervisor} onChange={e => ef('transferredToSupervisor', e.target.value)} /></div>
              <div className="form-group"><label>Remaining with Enumerator</label><input type="number" min="0" value={editForm.remainingWithEnumerator} onChange={e => ef('remainingWithEnumerator', e.target.value)} /></div>
              <div className="form-group"><label>Checked by Supervisor</label><input type="number" min="0" value={editForm.checkedBySupervisor} onChange={e => ef('checkedBySupervisor', e.target.value)} /></div>
              <div className="form-group"><label>Transferred to District</label><input type="number" min="0" value={editForm.transferredToDistrict} onChange={e => ef('transferredToDistrict', e.target.value)} /></div>
              <div className="form-group"><label>Remaining with Supervisor</label><input type="number" min="0" value={editForm.remainingWithSupervisor} onChange={e => ef('remainingWithSupervisor', e.target.value)} /></div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setEditModal(null)}>Cancel</button>
              <button className="btn-save" onClick={frmSaveRecord}>{editModal.isNew ? 'Add Record' : 'Save Changes'}</button>
            </div>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="modal-box-frm" style={{ maxWidth: 360, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
            <h3>🗑️ Delete Record?</h3>
            <p>This will permanently remove <strong className="nep-text">{formRecords.find(r => r.code === confirmDelete)?.enumerator}</strong> ({confirmDelete}).</p>
            <div className="modal-actions" style={{ justifyContent: 'center' }}>
              <button className="btn-cancel" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn-save" style={{ background: '#ef4444' }} onClick={() => frmDeleteRecord(confirmDelete)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="modal-overlay" onClick={() => { setShowAttendanceModal(false); setCurrentLocation(null); setLocationError(''); stopLocationTracking(); }}>
          <div className="modal-box large" onClick={e => e.stopPropagation()}>
            <div className="modal-header-bar">
              <h3>📍 GPS Attendance System (Nepal Time)</h3>
              <button className="modal-close-x" onClick={() => { setShowAttendanceModal(false); setCurrentLocation(null); setLocationError(''); stopLocationTracking(); }}>✕</button>
            </div>
            <div className="warn-text" style={{ backgroundColor: darkMode ? '#1f2937' : '#fef3c7', padding: '8px 12px', borderRadius: '6px', marginBottom: '16px' }}>
              ⏰ <strong>Check-in:</strong> 8:00-9:00 AM NPT (Full Day) | After 9:00 AM = Half Day<br/>
              ⏰ <strong>Check-out:</strong> 5:00-6:00 PM NPT (Required daily)
            </div>
            {!currentLocation ? (
              <>
                <button className="get-loc-btn" onClick={() => { getCurrentLocation(); startLocationTracking(); }} disabled={isGettingLocation}>
                  {isGettingLocation ? '⏳ Getting Location...' : '📍 Get My Current Location'}
                </button>
                {locationError && <div className="error-msg">{locationError}</div>}
              </>
            ) : (
              <div className="loc-verified">
                <strong>✅ Location Obtained!</strong>
                <div className="loc-info">
                  <p>📍 <strong>{locationPlaceName || 'Fetching place name...'}</strong></p>
                  <p>Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}</p>
                  <p>Accuracy: ±{Math.round(currentLocation.accuracy)}m</p>
                </div>
              </div>
            )}
            <div className="form-group" style={{ marginTop: 16 }}>
              <label>Attendance Type</label>
              <select value={attendanceType} onChange={e => setAttendanceType(e.target.value)}>
                <option value="checkin" disabled={hasCheckIn}>
                  Check In (8:00-9:00 AM NPT) {hasCheckIn ? '✓ Already checked in' : ''}
                </option>
                <option value="checkout" disabled={!hasCheckIn || hasCheckOut}>
                  Check Out (5:00-6:00 PM NPT) {hasCheckOut ? '✓ Already checked out' : (!hasCheckIn ? '✗ Check in first' : '')}
                </option>
              </select>
            </div>
            <div className="form-group">
              <label>Work Description</label>
              <textarea value={workDescription} onChange={e => setWorkDescription(e.target.value)} rows="3" placeholder="Describe today's census work..." />
            </div>
            <div className="modal-actions">
              <button className="btn-primary" onClick={markAttendance} disabled={!currentLocation}>
                {attendanceType === 'checkin'
                  ? (hasCheckIn ? 'Already Checked In' : `✅ Confirm Check-in (${canCheckinNow ? '8-9 AM' : 'After Hours'})`)
                  : (hasCheckOut ? 'Already Checked Out' : `✅ Confirm Check-out (${canCheckoutNow ? '5-6 PM' : 'After Hours'})`)}
              </button>
              <button className="btn-secondary" onClick={() => { setShowAttendanceModal(false); setCurrentLocation(null); setLocationError(''); stopLocationTracking(); }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`toast-frm ${toast.type}`}>
          <span className="toast-icon">{toast.type === 'success' ? '✅' : toast.type === 'warn' ? '⚠️' : '❌'}</span>
          {toast.msg}
        </div>
      )}
    </div>
  );
};

export default Staff;
