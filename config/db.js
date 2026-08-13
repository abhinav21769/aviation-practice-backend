import mongoose from 'mongoose';

let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI is missing from environment variables.');
    return;
  }

  try {
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`🍃 MongoDB Atlas Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`❌ MongoDB Atlas Connection Error: ${err.message}`);
  }
}

export function isDbConnected() {
  return isConnected && mongoose.connection.readyState === 1;
}
