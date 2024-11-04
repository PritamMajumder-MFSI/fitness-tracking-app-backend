import { NextFunction, Request, Response, Router } from "express";

import { HttpException } from "../../classes";
import { Goal } from "../../models";
import { successResponse } from "../../utils";
import goalCreateSchema from "../../validators/goalCreateSchema";
const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error } = goalCreateSchema.validate(req.body);
    if (error) {
      throw new HttpException(422, error.message);
    }
    const userId = req.user?.userId;

    const { goalType, targetValue, from, to } = req.body;

    const goalDetails = await Goal.create({
      userId,
      goalType,
      targetValue,
      from,
      to,
      isActive: true,
    });

    successResponse({
      res,
      data: goalDetails,
      message: "Goal created successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
