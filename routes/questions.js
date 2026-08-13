import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve('data/interviewQuestions.json');

function getData() {
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// GET /api/questions
router.get('/', (req, res) => {
  try {
    const { questions, categories } = getData();
    const { category, search } = req.query;

    let filtered = questions;
    if (category) {
      filtered = filtered.filter((q) => q.category === category);
    }
    if (search) {
      const qLower = search.toLowerCase();
      filtered = filtered.filter((q) => q.question.toLowerCase().includes(qLower));
    }

    res.json({ success: true, count: filtered.length, categories, questions: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/questions/:id
router.get('/:id', (req, res) => {
  try {
    const { questions } = getData();
    const question = questions.find((q) => q.id === req.params.id);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
