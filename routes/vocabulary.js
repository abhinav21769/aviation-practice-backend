import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve('data/vocabulary.json');

function getData() {
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// GET /api/vocabulary
router.get('/', (req, res) => {
  try {
    const { vocabulary, categories } = getData();
    const { category, search } = req.query;

    let filtered = vocabulary;
    if (category) {
      filtered = filtered.filter((v) => v.category === category);
    }
    if (search) {
      const qLower = search.toLowerCase();
      filtered = filtered.filter((v) => v.word.toLowerCase().includes(qLower));
    }

    res.json({ success: true, count: filtered.length, categories, vocabulary: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/vocabulary/daily
router.get('/daily', (req, res) => {
  try {
    const { vocabulary } = getData();
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
    const dailyWord = vocabulary[dayOfYear % vocabulary.length];
    res.json({ success: true, dailyWord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/vocabulary/:id
router.get('/:id', (req, res) => {
  try {
    const { vocabulary } = getData();
    const word = vocabulary.find((v) => v.id === req.params.id);
    if (!word) {
      return res.status(404).json({ success: false, message: 'Word not found' });
    }
    res.json({ success: true, word });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
