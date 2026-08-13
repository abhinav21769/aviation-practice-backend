import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const progressPath = path.resolve('data/userProgress.json');

function readProgress() {
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
      todayTasks: [],
      savedWords: [],
      completedQuestions: [],
      completedScenarios: [],
      weeklyProgress: [20, 35, 15, 40, 25, 10, 30],
      categoryProgress: { interview: 72, vocabulary: 58, english: 45, scenarios: 63, knowledge: 40, simulator: 55 },
      simulatorSessions: [],
    };
  }
}

function saveProgress(state) {
  try {
    fs.writeFileSync(progressPath, JSON.stringify(state, null, 2));
  } catch (err) {
    console.warn('Could not persist userProgress to disk:', err.message);
  }
}

// GET /api/progress
router.get('/', (req, res) => {
  const progress = readProgress();
  res.json({ success: true, progress });
});

// POST /api/progress/task
router.post('/task', (req, res) => {
  const { taskId } = req.body;
  const state = readProgress();
  state.todayTasks = state.todayTasks.map((t) =>
    t.id === taskId ? { ...t, completed: !t.completed } : t
  );
  saveProgress(state);
  res.json({ success: true, progress: state });
});

// POST /api/progress/word
router.post('/word', (req, res) => {
  const { wordId } = req.body;
  const state = readProgress();
  const alreadySaved = state.savedWords.includes(wordId);
  state.savedWords = alreadySaved
    ? state.savedWords.filter((w) => w !== wordId)
    : [...state.savedWords, wordId];
  saveProgress(state);
  res.json({ success: true, progress: state });
});

// POST /api/progress/question
router.post('/question', (req, res) => {
  const { questionId } = req.body;
  const state = readProgress();
  if (!state.completedQuestions.includes(questionId)) {
    state.completedQuestions.push(questionId);
    state.questionsAnswered += 1;
    state.categoryProgress.interview = Math.min(100, state.categoryProgress.interview + 2);
    saveProgress(state);
  }
  res.json({ success: true, progress: state });
});

// POST /api/progress/scenario
router.post('/scenario', (req, res) => {
  const { scenarioId } = req.body;
  const state = readProgress();
  if (!state.completedScenarios.includes(scenarioId)) {
    state.completedScenarios.push(scenarioId);
    state.scenariosCompleted += 1;
    state.categoryProgress.scenarios = Math.min(100, state.categoryProgress.scenarios + 2);
    saveProgress(state);
  }
  res.json({ success: true, progress: state });
});

// POST /api/progress/simulator
router.post('/simulator', (req, res) => {
  const { session } = req.body;
  const state = readProgress();
  state.mockInterviews += 1;
  state.simulatorSessions.push(session);
  state.categoryProgress.simulator = Math.min(100, state.categoryProgress.simulator + 5);
  saveProgress(state);
  res.json({ success: true, progress: state });
});

export default router;
