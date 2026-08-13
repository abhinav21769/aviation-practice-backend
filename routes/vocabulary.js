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

// GET /api/vocabulary/images
router.get('/images', async (req, res) => {
  const { word } = req.query;
  if (!word) return res.json({ success: true, images: [] });
  try {
    const query = encodeURIComponent(`${word} aviation aircraft`);
    const wikiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${query}&gsrlimit=6&prop=imageinfo&iiprop=url|thumburl&iiurlwidth=600&format=json`;
    const r = await fetch(wikiUrl, {
      headers: {
        'User-Agent': 'AviationPracticeCandidateApp/1.0 (study@aviationpractice.app)',
      },
    });
    const data = await r.json();
    const pages = data?.query?.pages || {};
    const images = Object.values(pages)
      .map((p) => p.imageinfo?.[0]?.thumburl || p.imageinfo?.[0]?.url)
      .filter((u) => u && !u.includes('.pdf') && !u.includes('.tif') && !u.includes('.ogg') && !u.includes('.ogv') && !u.includes('.svg.png'));
    res.json({ success: true, images });
  } catch (err) {
    res.json({ success: true, images: [] });
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
