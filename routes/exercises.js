import express from 'express';
import Exercise from '../models/Exercise.js';

const router = express.Router();

const categories = [
  { id: 'professionalise', label: 'Polite Transformations', icon: 'Smile' },
  { id: 'passenger_response', label: 'Passenger Responses', icon: 'MessageSquare' },
  { id: 'announcements', label: 'PA Announcements', icon: 'Megaphone' },
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
