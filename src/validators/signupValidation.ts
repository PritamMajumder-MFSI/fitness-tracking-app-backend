import joi from "joi";

export default joi.object({
  username: joi.string().alphanum().min(3).max(30).required(),
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(3)
    .max(8)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
});
