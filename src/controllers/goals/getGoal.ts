import { NextFunction, Request, Response, Router } from "express";
import { Goal } from "../../models";
import { successResponse } from "../../utils";
import mongoose from "mongoose";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 1000);
    const skip = (page - 1) * limit;

    const goals = await Goal.aggregate([
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
            {
              $lookup: {
                from: "workouttypes",
                localField: "type",
                foreignField: "_id",
                as: "typeInfo",
              },
            },
            {
              $unwind: {
                path: "$typeInfo",
                preserveNullAndEmptyArrays: true,
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
          workouts: 1,
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
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalGoals = await Goal.countDocuments({
      userId: userId,
      isActive: true,
    });

    const totalPages = Math.ceil(totalGoals / limit);

    successResponse({
      res,
      data: {
        goals,
        totalPages,
        currentPage: page,
        totalGoals,
      },
      message: "Goals retrieved successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
