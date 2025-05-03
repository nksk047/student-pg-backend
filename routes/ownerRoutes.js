const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, restrictTo } = require('../middleware/authMiddleware');
const OwnerVerification = require('../models/OwnerVerification');
const { isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// GET all pending verifications (admin only)
router.get('/admin/verifications', protect, isAdmin, async (req, res) => {
    const pending = await OwnerVerification.find({ status: 'pending' }).populate('owner', 'name email');
    res.json(pending);
  });
  

// PUT: Approve/Reject (admin only)
router.put('/admin/verifications/:id', protect, isAdmin, async (req, res) => {
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
  
    const updated = await OwnerVerification.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ message: `Owner verification ${status}`, updated });
  });


// POST: Upload verification document (only owners)
router.post('/verify', protect, restrictTo('owner'), upload.single('document'), async (req, res) => {
  try {
    const existing = await OwnerVerification.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ error: 'You already submitted a document' });
    }

    const verification = await OwnerVerification.create({
      owner: req.user._id,
      documentPath: req.file.path,
    });

    res.status(201).json({ message: 'Document uploaded', verification });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
