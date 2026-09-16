const mongoose = require('mongoose');

const pushTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  platform: {
    type: String,
    enum: ['ios', 'android', 'unknown'],
    default: 'unknown',
  },
  deviceId: {
    type: String,
    default: '',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastUsed: {
    type: Date,
    default: Date.now,
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

pushTokenSchema.index({ isActive: 1, lastUsed: -1 });

module.exports = mongoose.model('PushToken', pushTokenSchema);
