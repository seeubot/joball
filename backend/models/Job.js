const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['job', 'walkin', 'referral'],
    required: true
  },
  category: {
    type: String,
    enum: ['IT', 'Non-IT'],
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
    required: true,
    trim: true,
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
    enum: ['2024', '2025', '2026']
  }],
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  // Walk-in specific fields
  eventDate: Date,
  lastDate: Date,
  venue: String,
  timing: String,
  // Referral specific fields
  referrerName: {
    type: String,
    trim: true,
    default: ''
  },
  referrerCompany: {
    type: String,
    trim: true,
    default: ''
  },
  postedAt: {
    type: Date,
    default: Date.now
  }
});

jobSchema.index({ city: 1, type: 1, category: 1, isActive: 1 });
jobSchema.index({ skills: 1, isActive: 1 });

module.exports = mongoose.model('Job', jobSchema);
