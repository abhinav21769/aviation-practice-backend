import mongoose from 'mongoose';

const ScenarioSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: String,
    difficulty: String,
    situation: { type: String, required: true },
    options: [
      {
        id: String,
        text: String,
      },
    ],
    bestAnswer: { type: String, required: true },
    explanation: String,
    keySkills: [String],
    followUp: String,
    followUpAnswer: String,
  },
  { strict: false, timestamps: true }
);

export default mongoose.models.Scenario || mongoose.model('Scenario', ScenarioSchema);
