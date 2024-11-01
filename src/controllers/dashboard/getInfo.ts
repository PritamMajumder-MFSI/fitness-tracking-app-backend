import { NextFunction, Request, Response, Router } from "express";
import { Goal, Workout } from "../../models";
import { successResponse } from "../../utils";
import mongoose from "mongoose";
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const workoutStats = await Workout.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: "$calories" },
          totalWorkouts: { $count: {} },
        },
      },
      {
        $project: {
          _id: 0,
          totalCalories: 1,
          totalWorkouts: 1,
        },
      },
    ]);
    const recentWorkouts = await Workout.find({ userId: req.user?.userId })
      .populate("type")
      .sort({ createdAt: -1 })
      .limit(5);
    const recentGoals = await Goal.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          isActive: true,
        },
      },
      {
        $lookup: {
          from: "workouts",
          let: { fromDate: "$from", toDate: "$to", userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $gte: ["$date", "$$fromDate"] },
                    { $lte: ["$date", "$$toDate"] },
                  ],
                },
              },
            },
          ],
          as: "workouts",
        },
      },

      {
        $addFields: {
          totalCalories: {
            $sum: "$workouts.calories",
          },
          totalWorkouts: {
            $size: "$workouts",
          },
        },
      },
      {
        $project: {
          _id: 1,
          goalType: 1,
          userId: 1,
          targetValue: 1,
          isActive: 1,
          to: 1,
          from: 1,
          createdAt: 1,
          totalWorkouts: 1,
          totalCalories: 1,
          updatedAt: 1,
        },
      },
      { $limit: 5 },
    ]);
    successResponse({
      res,
      data: { workoutStats, recentWorkouts, recentGoals },
      message: "Fetched workout types successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
