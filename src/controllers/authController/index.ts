import { Router } from "express";
import signUpRoutes from "./signUp";
import loginRoutes from "./login";
import logoutRoutes from "./logout";
import validateTokenRoute from "./validateToken";
import verifyToken from "../../middlewares/verifyToken";
const router = Router();

router.use("/sign-up", signUpRoutes);
router.use("/login", loginRoutes);
router.use("/logout", logoutRoutes);
router.use("/validate-token", verifyToken, validateTokenRoute);

export default router;
