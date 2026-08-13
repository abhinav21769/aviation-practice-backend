import express from 'express';
import Question from '../models/Question.js';

const router = express.Router();

// Static category metadata for UI display
const categories = [
  { id: 'personal', label: 'Personal', icon: 'User' },
  { id: 'customer_service', label: 'Customer Service', icon: 'Heart' },
  { id: 'teamwork', label: 'Teamwork', icon: 'Users' },
  { id: 'behavioral', label: 'Behavioral', icon: 'Brain' },
  { id: 'pressure', label: 'Handling Pressure', icon: 'Zap' },
  { id: 'airline', label: 'Airline-Specific', icon: 'Plane' },
];

// GET /api/questions
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.question = { $regex: search, $options: 'i' };
    }

    const questions = await Question.find(filter).lean();
    res.json({ success: true, count: questions.length, categories, questions });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/questions/:id
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findOne({ id: req.params.id }).lean();
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }
    res.json({ success: true, question });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
