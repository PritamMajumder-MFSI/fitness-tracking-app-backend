import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { HttpException } from "../classes";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  console.log("Cookies", req.cookies);
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return next(new HttpException(401, "Access token is missing"));
  }

  try {
    const userData = verifyAccessToken(accessToken);
    console.log("user-->", userData);
    req.user = userData;
    next();
  } catch (error) {
    next(new HttpException(401, "Invalid access token"));
  }
};

export default verifyToken;
