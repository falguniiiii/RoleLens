const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

const limiter = (limit, windowMs, message) => rateLimit({
  windowMs, limit, standardHeaders: true, legacyHeaders: false, message: { message }
});
// brute-force protection on auth, cost protection on the AI / PDF endpoints
app.use(['/api/auth/login', '/api/auth/register'], limiter(20, 15 * 60 * 1000, 'Too many attempts. Please try again later.'));
const aiLimiter = limiter(30, 60 * 60 * 1000, 'Hourly generation limit reached. Please try again later.');
const pdfLimiter = limiter(20, 60 * 60 * 1000, 'Too many PDF requests. Please try again later.');

app.use('/api/interview', (req, res, next) => {
  if (req.method !== 'POST') return next();
  if (req.path === '/' || req.path === '') return aiLimiter(req, res, next);
  if (req.path.startsWith('/resume/pdf/')) return pdfLimiter(req, res, next);
  return next();
});

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/interview', require('./routes/interview.routes'));

// central error handler: never leak stack traces / internals to the client
app.use((err, req, res, next) => {
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(413).json({ message: 'Resume must be 3MB or smaller' });
  if (err.status && err.status < 500) return res.status(err.status).json({ message: err.message });
  console.error(err.message);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
});

module.exports = app;
