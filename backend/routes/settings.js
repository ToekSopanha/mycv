const express = require('express');
const { verifyToken } = require('./auth');
const { readJson, writeJson } = require('../lib/dataPath');

const router = express.Router();

const DEFAULTS = {
  greeting: 'Hi, my name is',
  name: '',
  titles: [],
  bio: ''
};

// GET /api/settings — public
router.get('/', (req, res) => {
  const settings = readJson('settings.json', DEFAULTS);
  res.json(settings);
});

// POST /api/settings — protected
router.post('/', verifyToken, (req, res) => {
  const current = readJson('settings.json', DEFAULTS);
  const updated = {
    greeting: req.body.greeting ?? current.greeting ?? DEFAULTS.greeting,
    name: req.body.name ?? current.name ?? DEFAULTS.name,
    titles: Array.isArray(req.body.titles) ? req.body.titles : (current.titles || DEFAULTS.titles),
    bio: req.body.bio ?? current.bio ?? DEFAULTS.bio
  };
  writeJson('settings.json', updated);
  res.json(updated);
});

module.exports = router;
