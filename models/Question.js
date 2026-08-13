import mongoose from 'mongoose';

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    categoryLabel: String,
    airline: String,
    difficulty: String,
    question: { type: String, required: true },
    whatTheyLookFor: String,
    framework: String,
    exampleAnswer: String,
    starApplicable: { type: Boolean, default: false },
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
    context: String,
  },
  { timestamps: true, strict: false }
);

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
