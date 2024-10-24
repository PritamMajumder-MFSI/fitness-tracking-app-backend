import { NextFunction, Request, Response, Router } from "express";
import { successResponse } from "../../utils/defaultResponses";
const router = Router();

router.post("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = {};

    successResponse({
      res,
      message: "User successfully created",
      data: result,
      status: 200,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
