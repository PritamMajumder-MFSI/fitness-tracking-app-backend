import { Router } from "express";
import verifyToken from "../../middlewares/verifyToken";
import getInfoRoute from "./getInfo";
import getInfoByDate from "./getInfoByDate";
const router = Router();

router.use("/get-info", verifyToken, getInfoRoute);
router.use("/get-info-by-date", verifyToken, getInfoByDate);
export default router;
