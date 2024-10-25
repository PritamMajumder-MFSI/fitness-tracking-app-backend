import { Router } from "express";
import getWorkoutRoute from "./getWorkout";
import postWorkoutRoute from "./postWorkout";
import patchWorkout from "./patchWorkout";
const router = Router();

router.get("/workout", getWorkoutRoute);
router.post("/workout", postWorkoutRoute);
router.patch("/workout", patchWorkout);

export default router;
