const mongoose = require('mongoose');

const blacklistTokenSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: [true, 'Token hash is required to be added to the blacklist'],
    unique: true
  }
}, { timestamps: true });

// JWTs expire after one day, so blacklist entries can expire automatically.
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 24 * 60 * 60 });

const BlacklistToken = mongoose.model('BlacklistToken', blacklistTokenSchema);

module.exports = BlacklistToken;
