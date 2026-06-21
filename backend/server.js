const express = require('express');
const cors = require('cors');
const path = require('path');

const projectsRouter = require('./routes/projects');
const skillsRouter = require('./routes/skills');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/projects', projectsRouter);
app.use('/api/skills', skillsRouter);
app.use('/api/auth', authRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Portfolio API is running' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 Portfolio API running at http://localhost:${PORT}`);
  console.log(`📁 Projects : http://localhost:${PORT}/api/projects`);
  console.log(`🛠  Skills   : http://localhost:${PORT}/api/skills`);
  console.log(`🔐 Auth     : http://localhost:${PORT}/api/auth/login\n`);
});
