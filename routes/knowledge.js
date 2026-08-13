import express from 'express';
import Knowledge from '../models/Knowledge.js';

const router = express.Router();

const categories = [
  { id: 'airline_profiles', label: 'Airline Profiles', icon: 'Building' },
  { id: 'aircraft_types', label: 'Aircraft Types', icon: 'Plane' },
  { id: 'safety_systems', label: 'Safety Systems', icon: 'ShieldCheck' },
  { id: 'grooming_standards', label: 'Grooming Standards', icon: 'Sparkles' },
  { id: 'service_procedures', label: 'Service Procedures', icon: 'Utensils' },
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
