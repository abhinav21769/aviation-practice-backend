import express from 'express';
import fs from 'fs';
import path from 'path';
import UserProgress from '../models/UserProgress.js';
import { isDbConnected } from '../config/db.js';

const router = express.Router();
const progressPath = path.resolve('data/userProgress.json');

// Local fallback helpers
function readLocalProgress() {
  try {
    const data = fs.readFileSync(progressPath, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    return {
      userName: 'Nishtha',
      questionsAnswered: 47,
      wordsLearned: 126,
      scenariosCompleted: 23,
      mockInterviews: 8,
      daysActive: 5,
      overallProgress: 68,
      currentStreak: 7,
      todayTasks: [
        { id: 't1', label: 'Learn 5 aviation terms', completed: true },
        { id: 't2', label: 'Practice 3 interview questions', completed: false },
        { id: 't3', label: 'Complete 5 situational scenarios', completed: false },
        { id: 't4', label: 'Practice one English response', completed: true }
      ],
      todayFocus: 'Handling Difficult Passengers & Emergency Escalation',
      todayEstimatedMinutes: 25,
      savedWords: [],
      completedQuestions: [],
      completedScenarios: [],
      weeklyProgress: [20, 35, 15, 40, 25, 10, 30],
      categoryProgress: { interview: 72, vocabulary: 58, english: 45, scenarios: 63, knowledge: 40, simulator: 55 },
      simulatorSessions: [],
    };
  }
}

function saveLocalProgress(state) {
  try {
    fs.writeFileSync(progressPath, JSON.stringify(state, null, 2));
  } catch (err) {
    console.warn('Local file write skipped:', err.message);
  }
}

// Database sync helper
async function getDbProgress() {
  if (isDbConnected()) {
    let doc = await UserProgress.findOne({ userName: 'Nishtha' });
    if (!doc) {
      const initial = readLocalProgress();
      doc = await UserProgress.create(initial);
    }
    return doc;
  }
  return null;
}

// GET /api/progress
router.get('/', async (req, res) => {
  try {
    if (isDbConnected()) {
      const dbDoc = await getDbProgress();
      return res.json({ success: true, progress: dbDoc, source: 'mongodb' });
    }
    const local = readLocalProgress();
    res.json({ success: true, progress: local, source: 'local' });
  } catch (err) {
    res.json({ success: true, progress: readLocalProgress(), source: 'fallback' });
  }
});

// POST /api/progress/task
router.post('/task', async (req, res) => {
  const { taskId } = req.body;
  try {
    if (isDbConnected()) {
      const doc = await getDbProgress();
      doc.todayTasks = doc.todayTasks.map((t) =>
        t.id === taskId ? { ...t.toObject(), completed: !t.completed } : t
      );
      await doc.save();
      return res.json({ success: true, progress: doc, source: 'mongodb' });
    }

    const state = readLocalProgress();
    state.todayTasks = state.todayTasks.map((t) =>
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    saveLocalProgress(state);
    res.json({ success: true, progress: state, source: 'local' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/word
router.post('/word', async (req, res) => {
  const { wordId } = req.body;
  try {
    if (isDbConnected()) {
      const doc = await getDbProgress();
      const alreadySaved = doc.savedWords.includes(wordId);
      doc.savedWords = alreadySaved
        ? doc.savedWords.filter((w) => w !== wordId)
        : [...doc.savedWords, wordId];
      await doc.save();
      return res.json({ success: true, progress: doc, source: 'mongodb' });
    }

    const state = readLocalProgress();
    const alreadySaved = state.savedWords.includes(wordId);
    state.savedWords = alreadySaved
      ? state.savedWords.filter((w) => w !== wordId)
      : [...state.savedWords, wordId];
    saveLocalProgress(state);
    res.json({ success: true, progress: state, source: 'local' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/question
router.post('/question', async (req, res) => {
  const { questionId } = req.body;
  try {
    if (isDbConnected()) {
      const doc = await getDbProgress();
      if (!doc.completedQuestions.includes(questionId)) {
        doc.completedQuestions.push(questionId);
        doc.questionsAnswered += 1;
        doc.categoryProgress.interview = Math.min(100, doc.categoryProgress.interview + 2);
        await doc.save();
      }
      return res.json({ success: true, progress: doc, source: 'mongodb' });
    }

    const state = readLocalProgress();
    if (!state.completedQuestions.includes(questionId)) {
      state.completedQuestions.push(questionId);
      state.questionsAnswered += 1;
      state.categoryProgress.interview = Math.min(100, state.categoryProgress.interview + 2);
      saveLocalProgress(state);
    }
    res.json({ success: true, progress: state, source: 'local' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/scenario
router.post('/scenario', async (req, res) => {
  const { scenarioId } = req.body;
  try {
    if (isDbConnected()) {
      const doc = await getDbProgress();
      if (!doc.completedScenarios.includes(scenarioId)) {
        doc.completedScenarios.push(scenarioId);
        doc.scenariosCompleted += 1;
        doc.categoryProgress.scenarios = Math.min(100, doc.categoryProgress.scenarios + 2);
        await doc.save();
      }
      return res.json({ success: true, progress: doc, source: 'mongodb' });
    }

    const state = readLocalProgress();
    if (!state.completedScenarios.includes(scenarioId)) {
      state.completedScenarios.push(scenarioId);
      state.scenariosCompleted += 1;
      state.categoryProgress.scenarios = Math.min(100, state.categoryProgress.scenarios + 2);
      saveLocalProgress(state);
    }
    res.json({ success: true, progress: state, source: 'local' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/simulator
router.post('/simulator', async (req, res) => {
  const { session } = req.body;
  try {
    if (isDbConnected()) {
      const doc = await getDbProgress();
      doc.mockInterviews += 1;
      doc.simulatorSessions.push(session);
      doc.categoryProgress.simulator = Math.min(100, doc.categoryProgress.simulator + 5);
      await doc.save();
      return res.json({ success: true, progress: doc, source: 'mongodb' });
    }

    const state = readLocalProgress();
    state.mockInterviews += 1;
    state.simulatorSessions.push(session);
    state.categoryProgress.simulator = Math.min(100, state.categoryProgress.simulator + 5);
    saveLocalProgress(state);
    res.json({ success: true, progress: state, source: 'local' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
