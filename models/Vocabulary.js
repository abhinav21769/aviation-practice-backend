import mongoose from 'mongoose';

const VocabularySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    word: { type: String, required: true },
    phonetic: String,
    category: { type: String, required: true },
    categoryLabel: String,
    definition: { type: String, required: true },
    inContext: String,
    dialogue: {
      crew: String,
      passenger: String,
      context: String,
    },
    commonCollocations: [String],
    usageTip: String,
  },
  { timestamps: true }
);

export default mongoose.models.Vocabulary || mongoose.model('Vocabulary', VocabularySchema);
