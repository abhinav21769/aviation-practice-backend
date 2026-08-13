import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

const categories = [
  { id: 'politeness', label: 'Polite Transformations', icon: 'Smile' },
  { id: 'announcements', label: 'PA Announcements', icon: 'Megaphone' },
  { id: 'dialogues', label: 'Passenger Dialogues', icon: 'MessageSquare' },
  { id: 'grammar', label: 'Aviation Grammar', icon: 'CheckCircle2' },
];

// GET /api/exercises
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const exercises = await Exercise.find(filter).lean();
    res.json({ success: true, count: exercises.length, categories, exercises });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
