const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  address: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  name: {
    type: String,
    default: 'Anonymous User'
  },
  email: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['PATIENT', 'DOCTOR'],
    default: 'PATIENT'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', UserSchema);
