import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import pool from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import habitRoutes from './routes/habitRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import articleRoutes from './routes/articleRoutes.js';
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

app.get('/', (req, res) => {
  res.send('SehatJiwa API is running');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

