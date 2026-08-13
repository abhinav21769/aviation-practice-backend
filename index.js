import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';
import { seedDatabase } from './scripts/seed.js';
import Question from './models/Question.js';

import questionsRouter from './routes/questions.js';
import vocabularyRouter from './routes/vocabulary.js';
import scenariosRouter from './routes/scenarios.js';
import exercisesRouter from './routes/exercises.js';
import knowledgeRouter from './routes/knowledge.js';
import progressRouter from './routes/progress.js';
import aiRouter from './routes/ai.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB Atlas and auto-seed if empty
async function initServer() {
  await connectDB();
  try {
    const qCount = await Question.countDocuments();
    if (qCount === 0) {
      console.log('🌱 Empty database detected. Auto-seeding MongoDB Atlas...');
      await seedDatabase();
    }
  } catch (err) {
    console.warn('Auto-seed check failed:', err.message);
  }
}

initServer();

// CORS setup allowing all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// API Routes
app.use('/api/questions', questionsRouter);
app.use('/api/vocabulary', vocabularyRouter);
app.use('/api/scenarios', scenariosRouter);
app.use('/api/exercises', exercisesRouter);
app.use('/api/knowledge', knowledgeRouter);
app.use('/api/progress', progressRouter);
app.use('/api/ai', aiRouter);

// Health Check Endpoint (Reports live MongoDB status)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Aviation Practice Express Backend (MongoDB Atlas)',
    database: isDbConnected() ? 'MongoDB Atlas (Connected)' : 'Connecting...',
    user: 'Nishtha',
    time: new Date().toISOString(),
  });
});

app.get('/', (req, res) => {
  res.send('✈️ Aviation Practice Express Backend Server with MongoDB Atlas is running smoothly!');
});

app.listen(PORT, () => {
  console.log(`✈️ Aviation Practice Express Backend running on http://localhost:${PORT}`);
});
