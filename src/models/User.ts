import mongoose, { CallbackError, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IOtp, IUser } from "../types/interfaces";
const otpSchema: Schema<IOtp> = new Schema(
  {
    value: { type: String, required: true },
    validUntil: { type: Date, required: true },
  },
  {
    _id: false,
    timestamps: false,
  }
);
const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: otpSchema, required: false },
});

UserSchema.pre<IUser>("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const saltRounds = 10;
      this.password = await bcrypt.hash(this.password, saltRounds);
      next();
    } catch (error) {
      next(error as CallbackError);
    }
  } else {
    next();
  }
});

UserSchema.methods.verifyPassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};
export default mongoose.model<IUser>("user", UserSchema);
