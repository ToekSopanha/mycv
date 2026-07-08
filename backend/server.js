const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const authRouter = require('./routes/auth');
const settingsRouter = require('./routes/settings');
const aboutRouter = require('./routes/about');
const contactRouter = require('./routes/contact');
const uploadRouter = require('./routes/upload');
const cvRouter = require('./routes/cv');

const app = express();
const PORT = process.env.PORT || 3001;

// Warn if JWT_SECRET is not set; do not crash so local dev still works.
if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET not set. Using default dev secret. Set JWT_SECRET in production.');
}

// Ensure uploads root directory exists at startup (useful in Docker where
// the volume mount may start empty).
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Middleware
// CORS_ORIGIN may be a comma-separated list of allowed origins.
// Defaults to the Vite dev server origin.
const corsOrigin = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());

// Static uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/auth', authRouter);
app.use('/api/settings', settingsRouter);
app.use('/api/about', aboutRouter);
app.use('/api/contact', contactRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/download/cv', cvRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio API running at http://localhost:${PORT}`);
  console.log(`📁 Projects : http://localhost:${PORT}/api/projects`);
  console.log(`🛠  Skills   : http://localhost:${PORT}/api/skills`);
  console.log(`🔐 Auth     : http://localhost:${PORT}/api/auth/login`);
  console.log(`⚙️  Settings : http://localhost:${PORT}/api/settings`);
  console.log(`👤 About    : http://localhost:${PORT}/api/about`);
  console.log(`✉️  Contact  : http://localhost:${PORT}/api/contact`);
  console.log(`📤 Upload   : http://localhost:${PORT}/api/upload/{profile,project}`);
  console.log(`📄 CV       : http://localhost:${PORT}/api/download/cv\n`);
});
