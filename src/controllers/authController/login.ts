import Router, { NextFunction, Request, Response } from "express";
import { HttpException } from "../../classes";
import {
  generateAccessToken,
  generateRefreshToken,
  successResponse,
} from "../../utils";
import {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../config";
import { User } from "../../models";
import { loginValidationSchema } from "../../validators";

const router = Router();

router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { body } = request;
      const { error } = loginValidationSchema.validate(body);
      if (error) {
        throw new HttpException(422, error.message);
      }
      const { email, password } = body;
      const user = await User.findOne({ email });
      if (!user) {
        throw new HttpException(401, "Invalid credentials");
      }

      const isPasswordValid = await user.verifyPassword(password);
      if (!isPasswordValid) {
        throw new HttpException(401, "Invalid credentials");
      }

      const accessToken = generateAccessToken(String(user._id));
      const refreshToken = generateRefreshToken(String(user._id));

      response.cookie("accessToken", accessToken, accessTokenCookieConfig);
      response.cookie("refreshToken", refreshToken, refreshTokenCookieConfig);

      successResponse({
        message: "Login successful",
        data: { user: { email, username: user.username } },
        res: response,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
