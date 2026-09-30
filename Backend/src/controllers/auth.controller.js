const { z } = require('zod');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const blacklistTokenModel = require('../models/blacklist.model');

const cookieOptions = {
  httpOnly: true,                                   // not readable from JS (XSS-safe)
  sameSite: 'lax',                                  // CSRF mitigation
  secure: process.env.NODE_ENV === 'production',    // HTTPS only in production
  maxAge: 24 * 60 * 60 * 1000
};

// z.string() rejects objects, so {"$ne": null} style NoSQL injection is impossible
const registerSchema = z.object({
  username: z.string().trim().min(3, 'Username must be at least 3 characters').max(30)
    .regex(/^[a-zA-Z0-9_.-]+$/, 'Username can only use letters, numbers, . _ -'),
  email: z.string().trim().toLowerCase().max(254).email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72, 'Password is too long')
});
const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(254),
  password: z.string().min(1).max(72)
});

const publicUser = (u) => ({ id: u._id, username: u.username, email: u.email });

function setAuthCookie(res, user) {
  const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d', algorithm: 'HS256' });
  res.cookie('token', token, cookieOptions);
}

/** @route POST /api/auth/register  @access Public */
async function registerUsercontroller(req, res) {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.issues[0].message });
  const { username, email, password } = parsed.data;

  const existingUser = await userModel.findOne({ $or: [{ username }, { email }] });
  if (existingUser) return res.status(400).json({ error: 'Username or email already exists' });

  const hash = await bcrypt.hash(password, 12);
  let user;
  try {
    user = await userModel.create({ username, email, password: hash });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Username or email already exists' });
    throw err;
  }

  setAuthCookie(res, user);
  res.status(201).json({ message: 'User registered successfully', user: publicUser(user) });
}

/** @route POST /api/auth/login  @access Public */
async function loginUsercontroller(req, res) {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid email or password' });
  const { email, password } = parsed.data;

  const user = await userModel.findOne({ email });
  // same message for "no user" and "wrong password" so accounts can't be enumerated
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: 'Invalid email or password' });
  }

  setAuthCookie(res, user);
  res.status(200).json({ message: 'User logged in successfully', user: publicUser(user) });
}

/** @route POST /api/auth/logout  @access Public */
async function logoutUsercontroller(req, res) {
  const token = req.cookies?.token;
  if (token && typeof token === 'string') {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await blacklistTokenModel.create({ tokenHash });
  }

  res.clearCookie('token', { httpOnly: true, sameSite: 'lax', secure: cookieOptions.secure });
  res.status(200).json({ message: 'User logged out successfully' });
}

/** @route GET /api/auth/get-me  @access Private */
async function getMeController(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) return res.status(401).json({ message: 'User no longer exists' });
  res.status(200).json({ message: 'User information retrieved successfully', user: publicUser(user) });
}

module.exports = { registerUsercontroller, loginUsercontroller, logoutUsercontroller, getMeController };
