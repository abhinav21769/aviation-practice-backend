import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categoryLabel: String,
    airline: String,
    difficulty: String,
    question: { type: String, required: true },
    context: String,
    starAnswer: {
      situation: String,
      task: String,
      action: String,
      result: String,
    },
    keyPhrases: [String],
    whatInterviewersLookFor: [String],
    commonMistakes: [String],
    proTip: String,
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
