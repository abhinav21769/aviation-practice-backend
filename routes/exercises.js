import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve('data/englishExercises.json');

function getData() {
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// GET /api/exercises
router.get('/', (req, res) => {
  try {
    const { exercises, categories } = getData();
    const { category } = req.query;

    let filtered = exercises;
    if (category) {
      filtered = filtered.filter((e) => e.category === category);
    }

    res.json({ success: true, count: filtered.length, categories, exercises: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
