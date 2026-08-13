import express from 'express';
import Knowledge from '../models/Knowledge.js';

const router = express.Router();

const categories = [
  { id: 'aircraft', label: 'Aircraft Types', icon: 'Plane' },
  { id: 'safety', label: 'Safety Systems', icon: 'ShieldCheck' },
  { id: 'service', label: 'Service Procedures', icon: 'Utensils' },
  { id: 'operations', label: 'Flight Operations', icon: 'Radio' },
  { id: 'regulations', label: 'Aviation Regulations', icon: 'BookOpen' },
];

// GET /api/knowledge
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const topics = await Knowledge.find(filter).lean();
    res.json({ success: true, count: topics.length, categories, topics });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/knowledge/:id
router.get('/:id', async (req, res) => {
  try {
    const topic = await Knowledge.findOne({ id: req.params.id }).lean();
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, topic });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
