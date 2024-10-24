import mongoose, { Types } from "mongoose";
import { IWorkout } from "../types/interfaces";

const workoutSchema = new mongoose.Schema<IWorkout>(
  {
    type: {
      type: Types.ObjectId,
      required: true,
      ref: "workoutType",
    },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    date: { type: Date, required: true },
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("workout", workoutSchema);
