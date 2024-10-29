import Router, { Request, Response } from "express";
import { successResponse } from "../../utils";

const router = Router();

router.get("/", (req: Request, response: Response) => {
  successResponse({
    message: "Validated token",
    data: { user: req.user },
    res: response,
  });
});

export default router;
