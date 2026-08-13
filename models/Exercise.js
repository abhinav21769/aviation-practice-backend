import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    category: { type: String },
    categoryLabel: String,
    title: String,
    description: String,
  },
  { strict: false, timestamps: true }
);

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);
