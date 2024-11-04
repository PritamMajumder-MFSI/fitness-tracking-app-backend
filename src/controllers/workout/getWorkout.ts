import { NextFunction, Request, Response, Router } from "express";
import { Workout } from "../../models";
import { successResponse } from "../../utils";
import mongoose from "mongoose";
import { HttpException } from "../../classes";
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new HttpException(400, "User id is required");
    }
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 1000);

    const skip = (page - 1) * limit;

    const result = await Workout.aggregate([
      {
        $match: { isActive: true, userId: new mongoose.Types.ObjectId(userId) },
      },
      {
        $lookup: {
          from: "workouttypes",
          localField: "type",
          foreignField: "_id",
          as: "workoutType",
        },
      },

      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
          totalCount: [{ $count: "total" }],
        },
      },
    ]);

    const workouts = result[0].data;
    const total = result[0].totalCount[0]?.total || 0;

    successResponse({
      res,
      data: { workouts, total },
      message: "Successfully fetched workouts",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
