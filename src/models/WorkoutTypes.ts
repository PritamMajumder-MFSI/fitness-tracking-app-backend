import mongoose from "mongoose";
import { IWorkoutType } from "../types/interfaces";

const workoutTypeSchema = new mongoose.Schema<IWorkoutType>(
  {
    workoutTypeName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("workoutTypes", workoutTypeSchema);
