import { Router } from "express";
import signUpRoutes from "./signUp";
import loginRoutes from "./login";
import logoutRoutes from "./logout";
const router = Router();

router.use("/sign-up", signUpRoutes);
router.use("/login", loginRoutes);
router.use("/logout", logoutRoutes);

export default router;
