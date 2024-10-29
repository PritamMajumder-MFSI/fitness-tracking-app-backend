import Joi from "joi";

export default Joi.object({
  goalType: Joi.string().required(),
  targetValue: Joi.number().required(),
  from: Joi.date().required(),
  to: Joi.date().required(),
});
