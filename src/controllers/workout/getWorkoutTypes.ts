import { NextFunction, Request, Response, Router } from "express";
import { WorkoutTypes } from "../../models";
import { successResponse } from "../../utils";
const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await WorkoutTypes.find({
      isActive: true,
    });
    successResponse({
      res,
      data: result,
      message: "Fetched workout types successfully",
      status: 200,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
