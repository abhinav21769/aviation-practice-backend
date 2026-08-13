import mongoose from 'mongoose';

const ScenarioSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: String,
    difficulty: String,
    summary: String,
    situation: String,
    passengerPersona: {
      type: String,
      emotionalState: String,
      underlyingNeed: String,
    },
    flightContext: String,
    options: [
      {
        id: String,
        text: String,
        score: Number,
        rationale: String,
      },
    ],
    resolutionFramework: {
      step1: String,
      step2: String,
      step3: String,
      step4: String,
    },
    whatInterviewersTest: String,
    realWorldContext: String,
  },
  { timestamps: true }
);

export default mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);
