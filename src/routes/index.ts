import { NextFunction, Router, Response, Request } from "express";
import {
  authController,
  goalController,
  workoutController,
  dashboardController,
  notificationController,
} from "../controllers";
import { HttpException } from "../classes";
import { errorResponse } from "../utils/defaultResponses";
const router = Router();

router.use("/auth", authController);
router.use("/workout", workoutController);
router.use("/goal", goalController);
router.use("/dashboard", dashboardController);
router.use("/notifications", notificationController);

router.use(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: HttpException, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal server error";
    console.log(err);
    errorResponse({ res, message, data: {}, status });
  }
);

export default router;
