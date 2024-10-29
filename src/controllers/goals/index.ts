import { Router } from "express";
import postGoalRoute from "./postGoal";
import getGoalRoute from "./getGoal";
import verifyToken from "../../middlewares/verifyToken";
const router = Router();

router.post("/", verifyToken, postGoalRoute);
router.get("/", verifyToken, getGoalRoute);
export default router;
