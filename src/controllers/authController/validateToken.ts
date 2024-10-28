import Router, { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils";

const router = Router();

router.get("/", (_: Request, response: Response) => {
  successResponse({ message: "Validated token", data: {}, res: response });
});

export default router;
