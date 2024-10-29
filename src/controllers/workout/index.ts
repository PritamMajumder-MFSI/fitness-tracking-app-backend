import { Router } from "express";
import getWorkoutRoute from "./getWorkout";
import postWorkoutRoute from "./postWorkout";
import patchWorkout from "./patchWorkout";
import WorkoutTypeRoutes from "./getWorkoutTypes";
import verifyToken from "../../middlewares/verifyToken";
const router = Router();

router.use(
  "/workout-types",

  WorkoutTypeRoutes
);
router.get("/", verifyToken, getWorkoutRoute);
router.post("/", verifyToken, postWorkoutRoute);
router.patch("/", verifyToken, patchWorkout);

export default router;
