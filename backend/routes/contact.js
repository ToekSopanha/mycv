const express = require('express');
const { verifyToken } = require('./auth');
const { readJson, writeJson } = require('../lib/dataPath');

const router = express.Router();

const DEFAULTS = {
  email: '',
  phone: '',
  location: '',
  github: '',
  telegram: '',
  linkedin: ''
};

// GET /api/contact — public
router.get('/', (req, res) => {
  const contact = readJson('contact.json', DEFAULTS);
  res.json(contact);
});

// POST /api/contact — protected
router.post('/', verifyToken, (req, res) => {
  const current = readJson('contact.json', DEFAULTS);
  const updated = {
    email: req.body.email ?? current.email ?? DEFAULTS.email,
    phone: req.body.phone ?? current.phone ?? DEFAULTS.phone,
    location: req.body.location ?? current.location ?? DEFAULTS.location,
    github: req.body.github ?? current.github ?? DEFAULTS.github,
    telegram: req.body.telegram ?? current.telegram ?? DEFAULTS.telegram,
    linkedin: req.body.linkedin ?? current.linkedin ?? DEFAULTS.linkedin
  };
  writeJson('contact.json', updated);
  res.json(updated);
});

module.exports = router;
