import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('ℹ️ No MONGODB_URI found in environment. Running with local JSON fallback.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Atlas Connection Error: ${err.message}`);
    console.log('ℹ️ Operating in fallback mode using local data.');
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
