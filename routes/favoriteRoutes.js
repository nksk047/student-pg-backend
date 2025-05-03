const express = require('express');
const router = express.Router();
const Favorite = require('../models/Favorite');
const PG = require('../models/PG');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Add to favorites
router.post('/:pgId', protect, restrictTo('student'), async (req, res) => {
  try {
    const existing = await Favorite.findOne({ student: req.user._id, pg: req.params.pgId });
    if (existing) return res.status(400).json({ error: 'Already favorited' });

    const fav = await Favorite.create({ student: req.user._id, pg: req.params.pgId });
    res.status(201).json(fav);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all favorites for logged-in student
router.get('/', protect, restrictTo('student'), async (req, res) => {
  try {
    const favorites = await Favorite.find({ student: req.user._id }).populate('pg');
    res.json(favorites.map(fav => fav.pg));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
