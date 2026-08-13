import express from 'express';
import Vocabulary from '../models/Vocabulary.js';

const router = express.Router();

const categories = [
  { id: 'aircraft', label: 'Aircraft', icon: 'Plane' },
  { id: 'airport', label: 'Airport', icon: 'Building2' },
  { id: 'cabin', label: 'Cabin', icon: 'LayoutGrid' },
  { id: 'service', label: 'Service', icon: 'Coffee' },
  { id: 'safety', label: 'Safety', icon: 'ShieldAlert' },
  { id: 'emergency', label: 'Emergency', icon: 'AlertTriangle' },
  { id: 'operations', label: 'Operations', icon: 'Radio' },
  { id: 'announcements', label: 'Announcements', icon: 'Megaphone' },
];

// GET /api/vocabulary
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    const filter = {};

    if (category) {
      filter.category = category;
    }
    if (search) {
      filter.word = { $regex: search, $options: 'i' };
    }

    const vocabulary = await Vocabulary.find(filter).lean();
    res.json({ success: true, count: vocabulary.length, categories, vocabulary });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/vocabulary/daily
router.get('/daily', async (req, res) => {
  try {
    const vocabulary = await Vocabulary.find({}).lean();
    if (!vocabulary.length) {
      return res.status(404).json({ success: false, message: 'No vocabulary available' });
    }
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dailyWord = vocabulary[dayOfYear % vocabulary.length];
    res.json({ success: true, dailyWord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/vocabulary/:id
router.get('/:id', async (req, res) => {
  try {
    const word = await Vocabulary.findOne({ id: req.params.id }).lean();
    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }
    res.json({ success: true, word });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
