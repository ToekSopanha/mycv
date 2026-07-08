const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

const CV_PATH = path.join(__dirname, '../uploads/cv.pdf');

// GET /api/download/cv — public
router.get('/', (req, res) => {
  if (!fs.existsSync(CV_PATH)) {
    return res.status(404).json({ error: 'CV file not found. Please upload cv.pdf to backend/uploads/.' });
  }
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="cv.pdf"');
  fs.createReadStream(CV_PATH).pipe(res);
});

module.exports = router;
