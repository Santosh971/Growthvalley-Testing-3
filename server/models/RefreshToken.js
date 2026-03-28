const mongoose = require('mongoose');
const crypto = require('crypto');

const refreshTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    unique: true
    // Note: unique: true already creates an index, no need for index: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 } // TTL index
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate refresh token
refreshTokenSchema.statics.generateToken = function() {
  return crypto.randomBytes(40).toString('hex');
};

// Clean expired tokens
refreshTokenSchema.statics.cleanExpired = function() {
  return this.deleteMany({ expiresAt: { $lt: new Date() } });
};

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);