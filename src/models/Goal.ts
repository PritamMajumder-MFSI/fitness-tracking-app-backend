import mongoose from "mongoose";
import { IGoal } from "../types/interfaces";
import { EGoalType } from "../types/enums";
const goalSchema = new mongoose.Schema<IGoal>(
  {
    goalType: {
      type: String,
      required: true,
      enum: EGoalType,
    },
    targetValue: { type: Number, required: true },
    achieved: { type: Boolean, required: true },
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("goal", goalSchema);
