import { Document, Schema } from "mongoose";
import { TGoalType } from "./types";

export interface IWorkout extends Document {
  type: Schema.Types.ObjectId;
  duration: number;
  calories: number;
  userId: Schema.Types.ObjectId;
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
  from: Date;
  to: Date;
  userId: Schema.Types.ObjectId;
  isActive: Boolean;
}
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  verifyPassword(password: string): Promise<boolean>;
}
