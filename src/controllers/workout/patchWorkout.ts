import { NextFunction, Request, Response, Router } from "express";
const router = Router();

router.patch("/", (req: Request, res: Response, next: NextFunction) => {
  try {
  } catch (error) {
    next(error);
  }
});

export default router;
