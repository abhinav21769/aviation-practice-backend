import express from 'express';

const router = express.Router();

const AIRLINE_PROMPTS = {
  Emirates: [
    'Why do you specifically want to move to Dubai and work for Emirates?',
    'Emirates represents over 160 nationalities. How do you adapt your communication style in multicultural teams?',
    'Describe a situation where you delivered luxury customer service exceeding customer expectations.',
    'How would you handle a demanding First Class passenger requesting an item that is out of stock?',
  ],
  'Qatar Airways': [
    'Qatar Airways is known for 5-star service. What does 5-star service mean to you in practice?',
    'How do you maintain high energy and immaculate grooming during a 14-hour long-haul flight?',
  ],
  'Singapore Airlines': [
    'Singapore Airlines sets the global benchmark for hospitality. How do you embody warmth and attention to detail?',
    'Give an example of how you handle high-pressure situations with grace and composure.',
  ],
};

// POST /api/ai/question-generate
router.post('/question-generate', (req, res) => {
  const { airline = 'Emirates' } = req.body;
  const prompts = AIRLINE_PROMPTS[airline] || AIRLINE_PROMPTS.Emirates;
  const question = prompts[Math.floor(Math.random() * prompts.length)];

  res.json({
    success: true,
    question: {
      id: `ai-q-${Date.now()}`,
      question,
      category: 'airline',
      airline,
      difficulty: 'medium',
      whatTheyLookFor: `Interviewers at ${airline} look for brand alignment, cultural adaptability, and structured STAR answers.`,
      framework: `Use STAR framework. Connect your answer directly to ${airline}'s service standards.`,
      exampleAnswer: `I chose ${airline} because of your commitment to world-class service...`,
      starApplicable: true,
      isAiGenerated: true,
    },
  });
});

// POST /api/ai/evaluate
router.post('/evaluate', (req, res) => {
  const { question, answer } = req.body;

  if (!answer || answer.trim().length < 15) {
    return res.json({
      success: true,
      evaluation: {
        scores: { communication: 48, confidence: 42, grammar: 52, structure: 38, professionalism: 50 },
        overallScore: 46,
        strengths: ['You attempted the response.'],
        improvements: [
          'Response is too brief. Aim for 60–90 seconds (100–180 words).',
          'Use the STAR framework (Situation, Task, Action, Result).',
        ],
        strongerVersion: 'A stronger answer provides a concrete real-world example of your personal intervention.',
        tip: 'Focus on quality over length: Situation → Action → Positive Result.',
      },
    });
  }

  const scores = {
    communication: Math.floor(78 + Math.random() * 18),
    confidence: Math.floor(75 + Math.random() * 20),
    grammar: Math.floor(82 + Math.random() * 14),
    structure: Math.floor(76 + Math.random() * 18),
    professionalism: Math.floor(84 + Math.random() * 14),
  };

  const overallScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.keys(scores).length
  );

  res.json({
    success: true,
    evaluation: {
      scores,
      overallScore,
      strengths: [
        'Clear tone with professional vocabulary appropriate for cabin crew.',
        'Good structure linking your experience directly to passenger safety and comfort.',
      ],
      improvements: [
        'Emphasize your personal action ("I did") over general team actions.',
        'Add one quantifiable or positive outcome to close your response.',
      ],
      strongerVersion: `For "${question}", lead with your key strength, detail your specific intervention, and close with the positive passenger outcome.`,
      tip: 'Safety comes first, followed immediately by empathy and clear communication.',
    },
  });
});

export default router;
