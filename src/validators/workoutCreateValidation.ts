import joi from "joi";
export default joi.object({
  calories: joi.number().required(),
  date: joi.date().required(),
  duration: joi.number().min(1),
  type: joi.string(),
});
