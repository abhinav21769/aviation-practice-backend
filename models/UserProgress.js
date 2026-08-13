import mongoose from 'mongoose';

const UserProgressSchema = new mongoose.Schema(
  {
    userName: { type: String, default: 'Nishtha', unique: true },
    questionsAnswered: { type: Number, default: 0 },
    wordsLearned: { type: Number, default: 0 },
    scenariosCompleted: { type: Number, default: 0 },
    mockInterviews: { type: Number, default: 0 },
    daysActive: { type: Number, default: 1 },
    overallProgress: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: () => new Date().toDateString() },
    currentDay: { type: Number, default: 1 },
    todayTasks: [
      {
        id: { type: String, default: 't1' },
        label: { type: String, default: 'Learn 5 aviation terms' },
        completed: { type: Boolean, default: false },
      },
      {
        id: { type: String, default: 't2' },
        label: { type: String, default: 'Practice 3 interview questions' },
        completed: { type: Boolean, default: false },
      },
      {
        id: { type: String, default: 't3' },
        label: { type: String, default: 'Complete 5 situational scenarios' },
        completed: { type: Boolean, default: false },
      },
      {
        id: { type: String, default: 't4' },
        label: { type: String, default: 'Practice one English response' },
        completed: { type: Boolean, default: false },
      },
    ],
    todayFocus: { type: String, default: 'Personal Introduction & Customer Service Excellence' },
    todayEstimatedMinutes: { type: Number, default: 20 },
    savedWords: [{ type: String }],
    completedQuestions: [{ type: String }],
    completedScenarios: [{ type: String }],
    scenarioResponses: [
      {
        scenarioId: String,
        selectedOption: String,
        isCorrect: Boolean,
        answeredAt: { type: Date, default: Date.now },
      },
    ],
    weeklyProgress: { type: [Number], default: [0, 0, 0, 0, 0, 0, 0] },
    categoryProgress: {
      interview: { type: Number, default: 0 },
      vocabulary: { type: Number, default: 0 },
      english: { type: Number, default: 0 },
      scenarios: { type: Number, default: 0 },
      knowledge: { type: Number, default: 0 },
      simulator: { type: Number, default: 0 },
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
