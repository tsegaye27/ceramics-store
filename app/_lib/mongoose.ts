import mongoose, { Connection } from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

interface MongooseCache {
  conn: Connection | null;
  promise: Promise<Connection> | null;
}

let cached: MongooseCache = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to DB");
      return mongoose.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
