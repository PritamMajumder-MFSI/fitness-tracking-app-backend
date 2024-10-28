import joi from "joi";
export default joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .min(8)
    .max(30)
    .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
    .required(),
});
