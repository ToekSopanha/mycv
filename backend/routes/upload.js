const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('./auth');

const router = express.Router();

const UPLOAD_ROOT = path.join(__dirname, '../uploads');
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const CV_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function makeUploader(subdir, urlPrefix) {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      const dest = path.join(UPLOAD_ROOT, subdir);
      ensureDir(dest);
      cb(null, dest);
    },
    filename(req, file, cb) {
      const safe = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
      const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}-${safe}`;
      cb(null, unique);
    }
  });

  const upload = multer({
    storage,
    limits: { fileSize: MAX_SIZE },
    fileFilter(req, file, cb) {
      if (!file.mimetype || !file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed'));
      }
      cb(null, true);
    }
  });

  // Multer error handling wrapper — turns errors into 400 JSON responses
  function handle(req, res) {
    upload.single('file')(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ error: 'File too large (max 5 MB)' });
        }
        return res.status(400).json({ error: err.message || 'Upload failed' });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      res.json({ url: `${urlPrefix}/${req.file.filename}` });
    });
  }

  return handle;
}

// POST /api/upload/profile — protected
router.post('/profile', verifyToken, makeUploader('profile', '/uploads/profile'));

// POST /api/upload/project — protected
router.post('/project', verifyToken, makeUploader('projects', '/uploads/projects'));

// ── CV / Resume upload (PDF only, fixed filename) ────────────
const cvStorage = multer.diskStorage({
  destination(req, file, cb) {
    ensureDir(UPLOAD_ROOT);
    cb(null, UPLOAD_ROOT);
  },
  filename(req, file, cb) {
    cb(null, 'cv.pdf');
  }
});

const cvUpload = multer({
  storage: cvStorage,
  limits: { fileSize: CV_MAX_SIZE },
  fileFilter(req, file, cb) {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  }
});

// POST /api/upload/cv — protected (PDF only, max 10 MB)
router.post('/cv', verifyToken, (req, res) => {
  cvUpload.single('file')(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large (max 10 MB)' });
      }
      return res.status(400).json({ error: err.message || 'Upload failed' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    res.json({ url: '/api/download/cv', message: 'CV uploaded successfully' });
  });
});

module.exports = router;
