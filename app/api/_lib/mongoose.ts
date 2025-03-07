import mongoose from "mongoose";
import logger from "@/services/logger";

const dbConnect = async () => {
  if (mongoose.connection.readyState >= 1) return;

  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (error) {
    logger.error("MongoDB connection error:", error);
    throw error;
  }
};

export default dbConnect;
