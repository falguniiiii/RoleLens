require('dotenv').config();

for (const key of ['MONGO_URI', 'JWT_SECRET', 'GOOGLE_GENAI_API_KEY']) {
  if (!process.env[key]) { console.error(`Missing required env var: ${key}`); process.exit(1); }
}

const app = require('./src/app');
const connectDB = require('./src/config/database');

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
