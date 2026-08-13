import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, isDbConnected } from './config/db.js';

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

// Connect to MongoDB Atlas
connectDB();

// CORS Middleware
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

// Health Check endpoints (ideal for UptimeRobot, Render keep-alive, and monitoring)
const healthHandler = (req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    app: 'SkyReady Aviation Practice Backend',
    database: isDbConnected() ? 'connected' : 'connecting',
    timestamp: new Date().toISOString(),
  });
};

app.get('/health', healthHandler);
app.get('/api/health', healthHandler);
app.head('/health', (req, res) => res.status(200).end());
app.head('/api/health', (req, res) => res.status(200).end());
app.head('/', (req, res) => res.status(200).end());

app.get('/', (req, res) => {
  res.status(200).send('✈️ SkyReady Aviation Practice Express Backend is active and running smoothly!');
});

app.listen(PORT, () => {
  console.log(`✈️ Aviation Practice Express Backend running on http://localhost:${PORT}`);
});
