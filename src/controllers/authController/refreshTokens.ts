import Router, { NextFunction, Request, Response } from "express";
import { HttpException } from "../../classes";
import {
  generateAccessToken,
  generateRefreshToken,
  successResponse,
  verifyRefreshToken,
} from "../../utils";
import { User } from "../../models";
import {
  accessTokenCookieConfig,
  refreshTokenCookieConfig,
} from "../../config";

const router = Router();

router.post(
  "/",
  async (request: Request, response: Response, next: NextFunction) => {
    try {
      const { refreshToken } = request.cookies;

      if (!refreshToken) {
        throw new HttpException(401, "Refresh token is missing");
      }
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload.userId);

      if (!user) {
        throw new HttpException(401, "User not found");
      }

      const newAccessToken = generateAccessToken(
        String(user._id),
        user.username,
        user.email
      );
      const newRefreshToken = generateRefreshToken(
        String(user._id),
        user.username,
        user.email
      );

      response.cookie("accessToken", newAccessToken, accessTokenCookieConfig);
      response.cookie(
        "refreshToken",
        newRefreshToken,
        refreshTokenCookieConfig
      );

      successResponse({
        res: response,
        message: "Access token refreshed successfully",
        data: { accessToken: newAccessToken, refresToken: newRefreshToken },
      });
    } catch (error) {
      next(
        new HttpException(
          401,
          error instanceof Error ? error.message : "Invalid refresh token"
        )
      );
    }
  }
);

export default router;
