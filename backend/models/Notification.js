const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['job', 'walkin', 'referral', 'resource', 'system'],
    default: 'system',
    index: true,
  },
  data: {
    jobId: String,
    resourceId: String,
    company: String,
    city: String,
    screen: String,
    expiryDate: Date,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

// Compound index for query performance
notificationSchema.index({ isActive: 1, createdAt: -1 });

// Auto-delete after 30 days
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Notification', notificationSchema);
