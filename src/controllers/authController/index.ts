import { Router } from "express";
import signUpRoutes from "./signUp";
const router = Router();

router.use("/sign-up", signUpRoutes);

export default router;
