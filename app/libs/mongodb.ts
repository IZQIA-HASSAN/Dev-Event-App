import mongoose, { Mongoose } from "mongoose";

// MongoDB connection string from environment variables
const MONGODB_URI: string = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your .env.local file");
}

/**
 * Cached connection interface
 * Prevents multiple connections during development (hot reloading)
 */
interface MongooseCache {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

// Global cache to store the connection across hot reloads in development
declare global {
  var mongoose: MongooseCache;
}

const cached: MongooseCache = global.mongoose || { conn: null, promise: null };

// Save cache to global object
global.mongoose = cached;

/**
 * Connect to MongoDB
 * Returns cached connection if already connected
 */
async function connectDB(): Promise<Mongoose> {
  // If connection already exists, return it
  if (cached.conn) {
    return cached.conn;
  }

  // If no promise exists yet, create a new connection
  if (!cached.promise) {
    const options = {
      bufferCommands: false, // Disable buffering if not connected
    };

    cached.promise = mongoose.connect(MONGODB_URI, options);
  }

  try {
    // Wait for connection and cache it
    cached.conn = await cached.promise;
  } catch (error) {
    // Reset promise on failure so next call retries
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}

export default connectDB;