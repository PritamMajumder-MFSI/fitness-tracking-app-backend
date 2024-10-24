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
    const { refreshToken } = request.cookies;

    if (!refreshToken) {
      return next(new HttpException(401, "Refresh token is missing"));
    }

    try {
      const payload = verifyRefreshToken(refreshToken);
      const user = await User.findById(payload._id);

      if (!user) {
        throw new HttpException(401, "User not found");
      }

      const newAccessToken = generateAccessToken(String(user._id));
      const newRefreshToken = generateRefreshToken(String(user._id));

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
      next(new HttpException(401, "Invalid refresh token"));
    }
  }
);

export default router;
