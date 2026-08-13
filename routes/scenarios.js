import express from 'express';
import Scenario from '../models/Scenario.js';

const router = express.Router();

const categories = [
  { id: 'disruptive_passengers', label: 'Disruptive Passengers', icon: 'AlertTriangle' },
  { id: 'medical_emergencies', label: 'Medical Emergencies', icon: 'HeartPulse' },
  { id: 'safety_violations', label: 'Safety Violations', icon: 'ShieldAlert' },
  { id: 'service_recovery', label: 'Service Recovery', icon: 'SmilePlus' },
  { id: 'special_needs', label: 'Special Needs', icon: 'Accessibility' },
  { id: 'team_coordination', label: 'Team Coordination', icon: 'Users' },
  { id: 'irregular_operations', label: 'Irregular Operations', icon: 'Clock' },
];

// GET /api/scenarios
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const scenarios = await Scenario.find(filter).lean();
    res.json({ success: true, count: scenarios.length, categories, scenarios });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/scenarios/:id
router.get('/:id', async (req, res) => {
  try {
    const scenario = await Scenario.findOne({ id: req.params.id }).lean();
    if (!scenario) {
      return res.status(404).json({ success: false, message: 'Scenario not found' });
    }
    res.json({ success: true, scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
