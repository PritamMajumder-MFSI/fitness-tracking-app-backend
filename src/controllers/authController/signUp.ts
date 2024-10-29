import { NextFunction, Request, Response, Router } from "express";
import { successResponse } from "../../utils/defaultResponses";
import { signupValidationSchema } from "../../validators";
import { HttpException } from "../../classes";
import User from "../../models/User";
const router = Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { body } = req;
    const { error } = signupValidationSchema.validate(body);
    if (error) {
      throw new HttpException(422, error.message);
    }
    const existingUser = await User.findOne({ email: body.email });
    if (existingUser) {
      throw new HttpException(400, "User already exists");
    }

    const newUser = new User({
      username: body.username,
      email: body.email,
      password: body.password,
    });

    await newUser.save();

    successResponse({
      res,
      message: "User successfully created",
      data: { user: { username: body.username, email: body.email } },
      status: 200,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
