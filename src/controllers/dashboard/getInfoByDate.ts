import { NextFunction, Request, Response, Router } from "express";
import { successResponse } from "../../utils";
import { Workout } from "../../models";
import mongoose from "mongoose";
import { WorkoutStats } from "../../types/interfaces";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const daysOfMonth = Array.from({ length: 31 }, (_, i) =>
      (i + 1).toString()
    );
    const monthsOfYear = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const days = parseInt(req.query.days as string) || 7;
    const labels =
      days === 7 ? daysOfWeek : days === 365 ? monthsOfYear : daysOfMonth;

    const workouts = await Workout.aggregate([
      {
        $match: {
          isActive: true,
          userId: new mongoose.Types.ObjectId(req.user?.userId),
        },
      },
      {
        $lookup: {
          from: "workouttypes",
          localField: "type",
          foreignField: "_id",
          as: "typeInfo",
        },
      },
      { $unwind: "$typeInfo" },
      {
        $group: {
          _id:
            days === 7
              ? { $dayOfWeek: "$date" }
              : days === 365
              ? { $month: "$date" }
              : { $dayOfMonth: "$date" },
          totalCalories: { $sum: "$calories" },
          totalWorkouts: { $sum: 1 },
          workoutTypes: { $addToSet: "$typeInfo.workoutTypeName" },
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    const resultMap: Record<string, WorkoutStats> = {};
    labels.forEach((label) => {
      resultMap[label] = {
        totalCalories: 0,
        totalWorkouts: 0,
        workoutTypes: [],
      };
    });

    workouts.forEach((workout) => {
      const dateLabel = labels[workout._id - 1];
      resultMap[dateLabel] = {
        totalCalories: workout.totalCalories,
        totalWorkouts: workout.totalWorkouts,
        workoutTypes: workout.workoutTypes,
      };
    });

    const response = labels.map((label) => ({
      label,
      ...resultMap[label],
    }));

    successResponse({
      res,
      data: response,
      message: "Workouts retrieved successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
