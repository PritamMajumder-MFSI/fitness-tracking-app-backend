import { Document, Schema } from "mongoose";
import { TGoalType } from "./types";

export interface IWorkout extends Document {
  type: Schema.Types.ObjectId;
  duration: number;
  calories: number;
  date: Date;
  isActive: Boolean;
}

export interface IWorkoutType extends Document {
  workoutTypeName: string;
  isActive: Boolean;
}

export interface IGoal extends Document {
  goalType: TGoalType;
  targetValue: number;
  achieved: boolean;
  isActive: Boolean;
}
