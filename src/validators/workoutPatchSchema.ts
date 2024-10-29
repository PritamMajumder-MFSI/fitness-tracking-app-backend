import Joi from "joi";

export default Joi.object({
  _id: Joi.string().required(),
  name: Joi.string().min(3).max(50).optional(),
  duration: Joi.number().integer().min(1).max(300).optional(),
  calories: Joi.number().integer().min(1).optional(),
  isActive: Joi.boolean().optional(),
  date: Joi.date().optional(),
});
