import { Router } from "express";
import getNotficationRoutes from "./getNotification";
import verifyToken from "../../middlewares/verifyToken";
const router = Router();

router.use("/", verifyToken, getNotficationRoutes);
export default router;
