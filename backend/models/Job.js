const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['job', 'walkin'],
    required: true
  },
  jobTitle: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  company: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  city: {
    type: String,
    enum: ['Hyderabad', 'Bengaluru'],
    required: true,
    index: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  applyLink: {
    type: String,
    trim: true
  },
  expiryDate: {
    type: Date,
    required: true,
    index: true
  },
  batchEligible: [{
    type: String,
    enum: ['2023', '2024', '2025', '2026']
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  experience: {
    type: String,
    default: 'Fresher'
  },
  // Walk-in specific fields
  eventDate: Date,
  lastDate: Date,
  venue: String,
  timing: String,
  postedAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for better query performance
jobSchema.index({ city: 1, type: 1, isActive: 1 });
jobSchema.index({ skills: 1, isActive: 1 });

module.exports = mongoose.model('Job', jobSchema);
