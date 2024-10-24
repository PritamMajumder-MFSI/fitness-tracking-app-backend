import mongoose from "mongoose";
import { IWorkoutType } from "../types/interfaces";

const workoutTypeSchema = new mongoose.Schema<IWorkoutType>(
  {
    workoutTypeName: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("workoutType", workoutTypeSchema);
