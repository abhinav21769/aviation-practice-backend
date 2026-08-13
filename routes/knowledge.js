import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const dataPath = path.resolve('data/knowledgeTopics.json');

function getData() {
  const content = fs.readFileSync(dataPath, 'utf8');
  return JSON.parse(content);
}

// GET /api/knowledge
router.get('/', (req, res) => {
  try {
    const { topics, categories } = getData();
    const { category } = req.query;

    let filtered = topics;
    if (category) {
      filtered = filtered.filter((t) => t.category === category);
    }

    res.json({ success: true, count: filtered.length, categories, topics: filtered });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/knowledge/:id
router.get('/:id', (req, res) => {
  try {
    const { topics } = getData();
    const topic = topics.find((t) => t.id === req.params.id);
    if (!topic) {
      return res.status(404).json({ success: false, message: 'Topic not found' });
    }
    res.json({ success: true, topic });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
