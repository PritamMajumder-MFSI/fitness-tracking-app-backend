import { NextFunction, Request, Response, Router } from "express";
import workoutPatchSchema from "../../validators/workoutPatchSchema";
import { HttpException } from "../../classes";
import { Workout } from "../../models";
import { successResponse } from "../../utils";
const router = Router();

router.patch("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = workoutPatchSchema.validate(req.body, {
      stripUnknown: true,
    });
    if (error) {
      throw new HttpException(422, error.message);
    }
    const updatedWorkout = await Workout.findByIdAndUpdate(
      req.body._id,
      value,
      {
        new: true,
        runValidators: true,
      }
    );

    successResponse({
      res,
      data: updatedWorkout,
      message: "Workout created successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
