import mongoose from 'mongoose';

const KnowledgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    category: { type: String },
    categoryLabel: String,
    title: String,
  },
  { strict: false, timestamps: true }
);

export default mongoose.models.Knowledge || mongoose.model('Knowledge', KnowledgeSchema);
