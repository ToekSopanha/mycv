const express = require('express');
const { verifyToken } = require('./auth');
const { readJson, writeJson } = require('../lib/dataPath');

const router = express.Router();

function readData() {
  return readJson('projects.json', []);
}

function writeData(data) {
  writeJson('projects.json', data);
}

// GET /api/projects — public
router.get('/', (req, res) => {
  res.json(readData());
});

// GET /api/projects/:id — public
router.get('/:id', (req, res) => {
  const projects = readData();
  const project = projects.find(p => p.id === req.params.id);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json(project);
});

// POST /api/projects — protected
router.post('/', verifyToken, (req, res) => {
  const projects = readData();
  const newProject = {
    id: Date.now().toString(),
    title: req.body.title || 'Untitled',
    description: req.body.description || '',
    tags: req.body.tags || [],
    github: req.body.github || '',
    live: req.body.live || '',
    image: req.body.image || '',
    featured: req.body.featured || false,
    createdAt: new Date().toISOString()
  };
  projects.push(newProject);
  writeData(projects);
  res.status(201).json(newProject);
});

// PUT /api/projects/:id — protected
router.put('/:id', verifyToken, (req, res) => {
  const projects = readData();
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  projects[index] = { ...projects[index], ...req.body, id: req.params.id };
  writeData(projects);
  res.json(projects[index]);
});

// DELETE /api/projects/:id — protected
router.delete('/:id', verifyToken, (req, res) => {
  let projects = readData();
  const index = projects.findIndex(p => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Project not found' });

  projects.splice(index, 1);
  writeData(projects);
  res.json({ message: 'Project deleted successfully' });
});

module.exports = router;
