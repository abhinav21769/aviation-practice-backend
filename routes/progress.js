import express from 'express';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

// Helper to get or initialize Nishtha's progress document
async function getNishthaProgress() {
  let doc = await UserProgress.findOne({ userName: 'Nishtha' });
  if (!doc) {
    doc = await UserProgress.create({
      userName: 'Nishtha',
      questionsAnswered: 0,
      wordsLearned: 0,
      scenariosCompleted: 0,
      mockInterviews: 0,
      daysActive: 1,
      overallProgress: 0,
      currentStreak: 0,
      lastActiveDate: new Date().toDateString(),
      currentDay: 1,
      todayTasks: [
        { id: 't1', label: 'Learn 5 aviation terms', completed: false },
        { id: 't2', label: 'Practice 3 interview questions', completed: false },
        { id: 't3', label: 'Complete 5 situational scenarios', completed: false },
        { id: 't4', label: 'Practice one English response', completed: false },
      ],
      todayFocus: 'Personal Introduction & Customer Service Excellence',
      todayEstimatedMinutes: 20,
      savedWords: [],
      completedQuestions: [],
      completedScenarios: [],
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      categoryProgress: {
        interview: 0,
        vocabulary: 0,
        english: 0,
        scenarios: 0,
        knowledge: 0,
        simulator: 0,
      },
      simulatorSessions: [],
    });
  }
  return doc;
}

// GET /api/progress
router.get('/', async (req, res) => {
  try {
    const doc = await getNishthaProgress();
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/task
router.post('/task', async (req, res) => {
  const { taskId } = req.body;
  try {
    const doc = await getNishthaProgress();
    doc.todayTasks = doc.todayTasks.map((t) =>
      t.id === taskId ? { ...t.toObject(), completed: !t.completed } : t
    );
    await doc.save();
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/word
router.post('/word', async (req, res) => {
  const { wordId } = req.body;
  try {
    const doc = await getNishthaProgress();
    const alreadySaved = doc.savedWords.includes(wordId);
    doc.savedWords = alreadySaved
      ? doc.savedWords.filter((w) => w !== wordId)
      : [...doc.savedWords, wordId];
    if (!alreadySaved) {
      doc.wordsLearned += 1;
      doc.categoryProgress.vocabulary = Math.min(100, doc.categoryProgress.vocabulary + 1);
    }
    await doc.save();
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/question
router.post('/question', async (req, res) => {
  const { questionId, answer, starAnswer } = req.body;
  try {
    const doc = await getNishthaProgress();

    // Store or update written answer
    if (answer || starAnswer) {
      if (!doc.questionResponses) doc.questionResponses = [];
      const existingIdx = doc.questionResponses.findIndex((r) => r.questionId === questionId);
      if (existingIdx >= 0) {
        if (answer !== undefined) doc.questionResponses[existingIdx].answer = answer;
        if (starAnswer !== undefined) doc.questionResponses[existingIdx].starAnswer = starAnswer;
        doc.questionResponses[existingIdx].answeredAt = new Date();
      } else {
        doc.questionResponses.push({
          questionId,
          answer: answer || '',
          starAnswer: starAnswer || null,
          answeredAt: new Date(),
        });
      }
    }

    if (!doc.completedQuestions.includes(questionId)) {
      doc.completedQuestions.push(questionId);
      doc.questionsAnswered += 1;
      doc.categoryProgress.interview = Math.min(100, doc.categoryProgress.interview + 2);
    }

    await doc.save();
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/scenario
router.post('/scenario', async (req, res) => {
  const { scenarioId } = req.body;
  try {
    const doc = await getNishthaProgress();
    if (!doc.completedScenarios.includes(scenarioId)) {
      doc.completedScenarios.push(scenarioId);
      doc.scenariosCompleted += 1;
      doc.categoryProgress.scenarios = Math.min(100, doc.categoryProgress.scenarios + 2);
      await doc.save();
    }
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/progress/simulator
router.post('/simulator', async (req, res) => {
  const { session } = req.body;
  try {
    const doc = await getNishthaProgress();
    doc.mockInterviews += 1;
    doc.simulatorSessions.push(session);
    doc.categoryProgress.simulator = Math.min(100, doc.categoryProgress.simulator + 5);
    await doc.save();
    res.json({ success: true, progress: doc });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
