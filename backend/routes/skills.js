const express = require('express');
const { verifyToken } = require('./auth');
const { readJson, writeJson } = require('../lib/dataPath');

const router = express.Router();

function readData() {
  return readJson('skills.json', []);
}

function writeData(data) {
  writeJson('skills.json', data);
}

// GET /api/skills — public
router.get('/', (req, res) => {
  res.json(readData());
});

// POST /api/skills — protected
router.post('/', verifyToken, (req, res) => {
  const skills = readData();
  const newSkill = {
    id: Date.now().toString(),
    name: req.body.name || 'Unnamed Skill',
    category: req.body.category || 'Other',
    level: Math.min(100, Math.max(0, req.body.level || 50)),
    icon: req.body.icon || ''
  };
  skills.push(newSkill);
  writeData(skills);
  res.status(201).json(newSkill);
});

// PUT /api/skills/:id — protected
router.put('/:id', verifyToken, (req, res) => {
  const skills = readData();
  const index = skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });

  skills[index] = { ...skills[index], ...req.body, id: req.params.id };
  if (skills[index].level !== undefined) {
    skills[index].level = Math.min(100, Math.max(0, skills[index].level));
  }
  writeData(skills);
  res.json(skills[index]);
});

// DELETE /api/skills/:id — protected
router.delete('/:id', verifyToken, (req, res) => {
  let skills = readData();
  const index = skills.findIndex(s => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Skill not found' });

  skills.splice(index, 1);
  writeData(skills);
  res.json({ message: 'Skill deleted successfully' });
});

module.exports = router;
