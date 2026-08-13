import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Question from '../models/Question.js';
import Vocabulary from '../models/Vocabulary.js';
import Scenario from '../models/Scenario.js';
import Exercise from '../models/Exercise.js';
import Knowledge from '../models/Knowledge.js';
import UserProgress from '../models/UserProgress.js';

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is required to run seed script.');
  process.exit(1);
}

export async function seedDatabase() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri);
      console.log('🍃 Connected to MongoDB Atlas for seeding');
    }

    // 1. Seed Questions
    const questionsRaw = JSON.parse(fs.readFileSync(path.resolve('data/interviewQuestions.json'), 'utf8'));
    await Question.deleteMany({});
    await Question.insertMany(questionsRaw.questions);
    console.log(`✅ Seeded ${questionsRaw.questions.length} Questions into MongoDB`);

    // 2. Seed Vocabulary
    const vocabularyRaw = JSON.parse(fs.readFileSync(path.resolve('data/vocabulary.json'), 'utf8'));
    await Vocabulary.deleteMany({});
    await Vocabulary.insertMany(vocabularyRaw.vocabulary);
    console.log(`✅ Seeded ${vocabularyRaw.vocabulary.length} Vocabulary Words into MongoDB`);

    // 3. Seed Scenarios
    const scenariosRaw = JSON.parse(fs.readFileSync(path.resolve('data/scenarios.json'), 'utf8'));
    await Scenario.deleteMany({});
    await Scenario.insertMany(scenariosRaw.scenarios);
    console.log(`✅ Seeded ${scenariosRaw.scenarios.length} Scenarios into MongoDB`);

    // 4. Seed Exercises
    const exercisesRaw = JSON.parse(fs.readFileSync(path.resolve('data/englishExercises.json'), 'utf8'));
    await Exercise.deleteMany({});
    await Exercise.insertMany(exercisesRaw.exercises);
    console.log(`✅ Seeded ${exercisesRaw.exercises.length} Exercises into MongoDB`);

    // 5. Seed Knowledge Topics
    const knowledgeRaw = JSON.parse(fs.readFileSync(path.resolve('data/knowledgeTopics.json'), 'utf8'));
    await Knowledge.deleteMany({});
    await Knowledge.insertMany(knowledgeRaw.topics);
    console.log(`✅ Seeded ${knowledgeRaw.topics.length} Knowledge Topics into MongoDB`);

    // 6. Reset Nishtha's UserProgress to 0
    await UserProgress.deleteMany({});
    const initialProgress = {
      userName: 'Nishtha',
      questionsAnswered: 0,
      wordsLearned: 0,
      scenariosCompleted: 0,
      mockInterviews: 0,
      daysActive: 1,
      overallProgress: 0,
      currentStreak: 0,
      lastActiveDate: new Date().toDateString(),
      currentDay: 1,
      todayTasks: [
        { id: 't1', label: 'Learn 5 aviation terms', completed: false },
        { id: 't2', label: 'Practice 3 interview questions', completed: false },
        { id: 't3', label: 'Complete 5 situational scenarios', completed: false },
        { id: 't4', label: 'Practice one English response', completed: false },
      ],
      todayFocus: 'Personal Introduction & Customer Service Excellence',
      todayEstimatedMinutes: 20,
      savedWords: [],
      completedQuestions: [],
      completedScenarios: [],
      weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
      categoryProgress: {
        interview: 0,
        vocabulary: 0,
        english: 0,
        scenarios: 0,
        knowledge: 0,
        simulator: 0,
      },
      simulatorSessions: [],
    };
    await UserProgress.create(initialProgress);
    console.log("✅ Reset Nishtha's UserProgress to 0% in MongoDB");

    console.log('🎉 ALL DATASETS SUCCESSFULLY POPULATED IN MONGODB ATLAS!');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  }
}

// Run directly if invoked from command line
if (process.argv[1]?.endsWith('seed.js')) {
  seedDatabase().then(() => process.exit(0));
}
