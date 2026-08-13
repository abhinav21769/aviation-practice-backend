import express from 'express';
import Scenario from '../models/Scenario.js';
import UserProgress from '../models/UserProgress.js';

const router = express.Router();

const categories = [
  { id: 'difficult_passengers', label: 'Difficult Passengers', icon: 'AlertTriangle' },
  { id: 'service', label: 'Service Recovery', icon: 'SmilePlus' },
  { id: 'medical', label: 'Medical Emergencies', icon: 'HeartPulse' },
  { id: 'special_needs', label: 'Special Needs', icon: 'Accessibility' },
  { id: 'conflict', label: 'Passenger Conflicts', icon: 'Users' },
  { id: 'delays', label: 'Delays & Operations', icon: 'Clock' },
  { id: 'emergency', label: 'Safety & Emergency', icon: 'ShieldAlert' },
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

// POST /api/scenarios/:id/answer — Evaluate answer & persist to UserProgress
router.post('/:id/answer', async (req, res) => {
  try {
    const { selectedOption } = req.body;
    const scenario = await Scenario.findOne({ id: req.params.id }).lean();
    if (!scenario) {
      return res.status(404).json({ success: false, message: 'Scenario not found' });
    }

    const isCorrect = selectedOption === scenario.bestAnswer;

    // Persist to Nishtha's UserProgress
    let progress = await UserProgress.findOne({ userName: 'Nishtha' });
    if (!progress) {
      progress = await UserProgress.create({ userName: 'Nishtha' });
    }

    // Record response history
    const existingRespIndex = progress.scenarioResponses.findIndex((r) => r.scenarioId === scenario.id);
    if (existingRespIndex >= 0) {
      progress.scenarioResponses[existingRespIndex].selectedOption = selectedOption;
      progress.scenarioResponses[existingRespIndex].isCorrect = isCorrect;
      progress.scenarioResponses[existingRespIndex].answeredAt = new Date();
    } else {
      progress.scenarioResponses.push({
        scenarioId: scenario.id,
        selectedOption,
        isCorrect,
        answeredAt: new Date(),
      });
    }

    // Increment completed count if newly answered
    if (!progress.completedScenarios.includes(scenario.id)) {
      progress.completedScenarios.push(scenario.id);
      progress.scenariosCompleted += 1;
      progress.categoryProgress.scenarios = Math.min(100, progress.categoryProgress.scenarios + 2);
    }

    await progress.save();

    res.json({
      success: true,
      scenarioId: scenario.id,
      selectedOption,
      isCorrect,
      bestAnswer: scenario.bestAnswer,
      explanation: scenario.explanation,
      keySkills: scenario.keySkills,
      followUp: scenario.followUp,
      followUpAnswer: scenario.followUpAnswer,
      progress,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
