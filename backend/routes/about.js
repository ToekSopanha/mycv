const express = require('express');
const { verifyToken } = require('./auth');
const { readJson, writeJson } = require('../lib/dataPath');

const router = express.Router();

const DEFAULTS = {
  heading: '',
  paragraphs: [],
  techHeading: '',
  techList: [],
  profilePhoto: ''
};

// GET /api/about — public
router.get('/', (req, res) => {
  const about = readJson('about.json', DEFAULTS);
  res.json(about);
});

// POST /api/about — protected
router.post('/', verifyToken, (req, res) => {
  const current = readJson('about.json', DEFAULTS);
  const updated = {
    heading: req.body.heading ?? current.heading ?? DEFAULTS.heading,
    paragraphs: Array.isArray(req.body.paragraphs) ? req.body.paragraphs : (current.paragraphs || DEFAULTS.paragraphs),
    techHeading: req.body.techHeading ?? current.techHeading ?? DEFAULTS.techHeading,
    techList: Array.isArray(req.body.techList) ? req.body.techList : (current.techList || DEFAULTS.techList),
    profilePhoto: req.body.profilePhoto ?? current.profilePhoto ?? DEFAULTS.profilePhoto
  };
  writeJson('about.json', updated);
  res.json(updated);
});

module.exports = router;
