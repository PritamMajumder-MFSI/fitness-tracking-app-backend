import { Router } from "express";
import signUpRoutes from "./signUp";
import loginRoutes from "./login";
const router = Router();

router.use("/sign-up", signUpRoutes);
router.use("/login", loginRoutes);

export default router;
