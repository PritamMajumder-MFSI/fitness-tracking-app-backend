import mongoose, { Types } from "mongoose";
import { IWorkout } from "../types/interfaces";

const workoutSchema = new mongoose.Schema<IWorkout>(
  {
    type: {
      type: Types.ObjectId,
      required: true,
      ref: "workoutTypes",
    },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("workout", workoutSchema);
