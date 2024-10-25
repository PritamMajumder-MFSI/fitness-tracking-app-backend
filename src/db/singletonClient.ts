import mongoose from "mongoose";
import { credentials } from "../constants";
import cluster from "cluster";

const MONGODB_URI = credentials.MONGODB_URI!;
let mongoConnection: Promise<typeof mongoose> | null = null;

export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (!mongoConnection) {
    if (cluster.isPrimary) {
      console.log("Primary: Creating MongoDB connection...");
    }

    try {
      mongoConnection = mongoose.connect(MONGODB_URI, {
        maxPoolSize: 10,
      });

      if (cluster.isPrimary) {
        mongoose.connection.on("connected", () => {
          console.log("Primary: Connected to MongoDB.");
        });

        mongoose.connection.on("error", (err) => {
          console.error("Primary: MongoDB connection error:", err);
          mongoConnection = null;
        });

        mongoose.connection.on("disconnected", () => {
          console.warn("Primary: MongoDB connection lost.");
        });
      }

      return mongoConnection;
    } catch (error) {
      console.error("Primary: Failed to connect to MongoDB:", error);
      mongoConnection = null;
      throw error;
    }
  }

  if (cluster.isWorker) {
    console.log(`Worker ${process.pid}: Using MongoDB connection pool.`);
  }

  return mongoConnection;
};

export const closeDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};
