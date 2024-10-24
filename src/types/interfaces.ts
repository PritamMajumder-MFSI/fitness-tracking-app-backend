import { Document, Schema } from "mongoose";

export interface IWorkout extends Document {
  type: Schema.Types.ObjectId;
  duration: number;
  calories: number;
  date: Date;
  isActive: Boolean;
}

export interface IWorkoutType extends Document {
  workoutTypeName: string;
}
