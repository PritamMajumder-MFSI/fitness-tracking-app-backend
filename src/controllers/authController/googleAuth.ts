import Router, { NextFunction, Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../../utils";
import passport from "passport";
import { credentials } from "../../constants";
import { User } from "../../models";
import {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../config";
import { PassportUser } from "../../types/interfaces";
const router = Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  (request: Request, response: Response, next: NextFunction) => {
    try {
      passport.authenticate("google", { scope: ["profile", "email"] });
    } catch (error) {
      next(error);
    }
  }
);
router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      const googleUser = req.user as unknown as PassportUser;
      let existingUser = await User.findOne({
        email: googleUser.emails[0].value,
      });
      if (!existingUser) {
        const newUser = new User({
          username: googleUser.displayName,
          email: googleUser.emails[0].value,
          password: credentials.GOOGLE_DEFAULT_PASSWORD,
        });

        await newUser.save();
        existingUser = newUser;
      }
      const accessToken = generateAccessToken(
        String(existingUser._id),
        existingUser.email,
        existingUser.username
      );
      const refreshToken = generateRefreshToken(
        String(existingUser._id),
        existingUser.email,
        existingUser.username
      );

      response.cookie("accessToken", accessToken, accessTokenCookieConfig);
      response.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

      response.redirect(credentials.FRONTEND_URI!);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
