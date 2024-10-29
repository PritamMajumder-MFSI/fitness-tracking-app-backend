import { NextFunction, Request, Response, Router } from "express";
import { Workout, WorkoutTypes } from "../../models";
import { successResponse } from "../../utils";
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 1000);

    const skip = (page - 1) * limit;

    const result = await Workout.aggregate([
      { $match: { isActive: true } },
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

    console.log(result);
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
