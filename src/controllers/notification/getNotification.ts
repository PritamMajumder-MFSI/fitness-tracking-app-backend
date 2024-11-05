import Router, { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils";
import { HttpException } from "../../classes";
import { Notification } from "../../models";

const router = Router();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user?.userId) {
      throw new HttpException(401, "User id is required");
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId: req.user.userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalNotifications = await Notification.countDocuments({
      userId: req.user.userId,
    });

    const totalPages = Math.ceil(totalNotifications / limit);

    successResponse({
      message: "Obtained notifications successfully",
      data: {
        notifications,
        pagination: {
          totalNotifications,
          totalPages,
          currentPage: page,
          limit,
        },
      },
      res,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
