import { Document, Schema, Types } from "mongoose";
import { TGoalType } from "./types";

export interface IWorkout extends Document {
  type: Schema.Types.ObjectId;
  duration: number;
  calories: number;
  userId: Schema.Types.ObjectId;
  date: Date;
  isActive: boolean;
}

export interface IWorkoutType extends Document {
  workoutTypeName: string;
  isActive: boolean;
}

export interface IGoal extends Document {
  goalType: TGoalType;
  targetValue: number;
  from: Date;
  to: Date;
  userId: Schema.Types.ObjectId;
  isNotified: boolean;
  isActive: boolean;
}
export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  otp?: IOtp;
  verifyPassword(password: string): Promise<boolean>;
}
export interface IOtp {
  value: string;
  validUntil: Date;
}
export interface WorkoutStats {
  totalCalories: number;
  totalWorkouts: number;
  workoutTypes: string[];
}
export interface PassportUser {
  id: string;
  displayName: string;
  emails: { value: string }[];
}
export interface INotification {
  userId: Types.ObjectId;
  goalId: Types.ObjectId;
  message: string;
  createdAt: Date;
  isRead: boolean;
}
