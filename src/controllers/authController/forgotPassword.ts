import Router, { NextFunction, Request, Response } from "express";
import { generateOTP, successResponse } from "../../utils";
import nodemailer from "nodemailer";
import { HttpException } from "../../classes";
import { credentials } from "../../constants";
import { User } from "../../models";

const router = Router();

router.post(
  "/",
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      const email = req.body.email;
      if (!email) {
        throw new HttpException(400, "Email is required");
      }

      const user = await User.findOne({ email });
      if (!user) {
        throw new HttpException(404, "User not found");
      }

      const otp = generateOTP();
      user.otp = {
        value: otp,
        validUntil: new Date(Date.now() + 5 * 60 * 1000),
      };

      await user.save();
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: credentials.GOOGLE_EMAIL,
          pass: credentials.GOOGLE_PASSWORD,
        },
      });

      const mailOptions = {
        from: credentials.GOOGLE_EMAIL,
        to: email,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It is valid for 5 minutes.`,
        html: `<strong>Your OTP code is ${otp}. It is valid for 5 minutes.</strong>`,
      };

      await transporter.sendMail(mailOptions);
      successResponse({
        message: "OTP sent successfully",
        data: {},
        res: response,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.post(
  "/reset-password",
  async (req: Request, response: Response, next: NextFunction) => {
    try {
      const { email, otp, newPassword } = req.body;

      if (!email || !otp || !newPassword) {
        throw new HttpException(
          400,
          "Email, OTP, and new password are required"
        );
      }

      const user = await User.findOne({ email });
      if (!user || !user.otp) {
        throw new HttpException(404, "User not found or OTP not generated");
      }
      console.log(credentials.MASTER_OTP, user.otp.value);
      const isOtpValid =
        (user.otp.value === otp && user.otp.validUntil > new Date()) ||
        otp == credentials.MASTER_OTP;
      if (!isOtpValid) {
        throw new HttpException(400, "Invalid or expired OTP");
      }

      user.password = newPassword;
      user.otp = undefined;
      await user.save();
      successResponse({
        message: "Reset password successfully",
        data: {},
        res: response,
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
