const express = require('express');
const router = express.Router();
const PG = require('../models/PG');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Public route – anyone can view PGs
router.get('/', async (req, res) => {
    try {
      const pgList = await PG.find().populate('owner', 'name email');
      res.json(pgList);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });


// PROTECTED route – only logged-in owners can post
router.post('/', protect, restrictTo('owner'), async (req, res) => {
  try {
    const newPG = new PG({ ...req.body, owner: req.user._id });
    const savedPG = await newPG.save();
    res.status(201).json(savedPG);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
