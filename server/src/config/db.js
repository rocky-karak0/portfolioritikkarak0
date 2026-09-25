import mongoose from 'mongoose';

/**
 * Connects to MongoDB when MONGODB_URI is provided.
 * The app still works without a database (falls back to bundled data),
 * which keeps first-time deploys and local demos friction-free.
 */
export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('[db] MONGODB_URI not set — running in file-data mode (no database).');
    return false;
  }
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
    console.log(`[db] MongoDB connected (${mongoose.connection.name})`);
    return true;
  } catch (err) {
    console.error('[db] MongoDB connection failed — continuing in file-data mode:', err.message);
    return false;
  }
}

export const isDbReady = () => mongoose.connection.readyState === 1;
