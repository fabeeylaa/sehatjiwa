import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
import bookmarkRoutes from './routes/bookmarkRoutes.js';
import friendRoutes from './routes/friendRoutes.js';
import challengeRoutes from './routes/challengeRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);           
app.use('/api/assessments', assessmentRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/bookmarks', bookmarkRoutes);
app.use('/api/social/friends', friendRoutes);
app.use('/api/social/challenges', challengeRoutes);

app.get('/', (req, res) => {
  res.send('SehatJiwa API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

