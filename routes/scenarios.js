import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve('data/scenarios.json');

function getData() {
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// GET /api/scenarios
router.get('/', (req, res) => {
  try {
    const { scenarios, categories } = getData();
    const { category } = req.query;

    let filtered = scenarios;
    if (category) {
      filtered = filtered.filter((s) => s.category === category);
    }

    res.json({ success: true, count: filtered.length, categories, scenarios: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/scenarios/:id
router.get('/:id', (req, res) => {
  try {
    const { scenarios } = getData();
    const scenario = scenarios.find((s) => s.id === req.params.id);
    if (!scenario) {
      return res.status(404).json({ success: false, message: 'Scenario not found' });
    }
    res.json({ success: true, scenario });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
