import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { HttpException } from "../classes";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    return next(new HttpException(412, "Access token is missing"));
  }

  try {
    const userData = verifyAccessToken(accessToken);
    req.user = userData;
    next();
  } catch (error) {
    next(
      new HttpException(
        412,
        error instanceof Error ? error.message : "Invalid access token"
      )
    );
  }
};

export default verifyToken;
