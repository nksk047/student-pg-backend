const mongoose = require('mongoose');

const pgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  rent: {
    type: Number,
    required: true
  },
  type: {
    type: String, // e.g., 'Boys', 'Girls', 'Co-ed'
    required: true
  },
  amenities: {
    type: [String], // e.g., ['WiFi', 'Laundry', 'AC']
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('PG', pgSchema);
