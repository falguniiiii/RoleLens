const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const tokenBlacklistModel = require('../models/blacklist.model');

async function authUser(req, res, next) {
  const token = req.cookies?.token;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ['HS256']
    });
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const isTokenBlacklisted = await tokenBlacklistModel.exists({ tokenHash });

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: 'Token is invalid' });
  }

  req.user = decoded;
  next();
}

module.exports = { authUser };
