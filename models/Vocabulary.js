import mongoose from 'mongoose';

const VocabularySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    word: { type: String, required: true },
    category: { type: String, required: true },
    categoryLabel: String,
    partOfSpeech: String,
    pronunciation: String,
    definition: { type: String, required: true },
    exampleSentence: String,
    relatedWords: [String],
    difficulty: String,
    isDaily: Boolean,
  },
  { strict: false, timestamps: true }
);

export default mongoose.models.Vocabulary || mongoose.model('Vocabulary', VocabularySchema);
