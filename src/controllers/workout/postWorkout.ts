import { NextFunction, Request, Response, Router } from "express";
import workoutCreateValidation from "../../validators/workoutCreateValidation";
import { HttpException } from "../../classes";
import { Workout } from "../../models";
import { successResponse } from "../../utils";
const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = workoutCreateValidation.validate(req.body);
    if (error) {
      throw new HttpException(422, error.message);
    }
    const { type, calories, date, duration } = req.body;
    const workoutDetails = await Workout.create({
      userId: req.user?.userId,
      type,
      calories,
      duration,
      date,
      isActive: true,
    });
    successResponse({
      res,
      data: workoutDetails,
      message: "Workout created successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
