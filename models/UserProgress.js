import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema(
  {
    userName: { type: String, default: 'Nishtha', unique: true },
    questionsAnswered: { type: Number, default: 47 },
    wordsLearned: { type: Number, default: 126 },
    scenariosCompleted: { type: Number, default: 23 },
    mockInterviews: { type: Number, default: 8 },
    daysActive: { type: Number, default: 5 },
    overallProgress: { type: Number, default: 68 },
    currentStreak: { type: Number, default: 7 },
    lastActiveDate: { type: String, default: () => new Date().toDateString() },
    currentDay: { type: Number, default: 12 },
    todayTasks: [
      {
        id: String,
        label: String,
        completed: { type: Boolean, default: false },
      },
    ],
    todayFocus: { type: String, default: 'Handling Difficult Passengers & Emergency Escalation' },
    todayEstimatedMinutes: { type: Number, default: 25 },
    savedWords: [{ type: String }],
    completedQuestions: [{ type: String }],
    completedScenarios: [{ type: String }],
    weeklyProgress: [{ type: Number }],
    categoryProgress: {
      interview: { type: Number, default: 72 },
      vocabulary: { type: Number, default: 58 },
      english: { type: Number, default: 45 },
      scenarios: { type: Number, default: 63 },
      knowledge: { type: Number, default: 40 },
      simulator: { type: Number, default: 55 },
    },
    simulatorSessions: [
      {
        date: { type: Date, default: Date.now },
        airline: String,
        questionCount: Number,
        score: Number,
        feedback: String,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.UserProgress || mongoose.model('UserProgress', UserProgressSchema);
