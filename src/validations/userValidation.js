import Joi from "joi";

const validateUser = (user) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    role: Joi.string().valid("user", "vendor").default("user"), //more roles can be added here like .valid('user', 'admin', 'superadmin')
    password: Joi.string().min(6).max(100).messages({
      "string.min": "Password must be at least 6 characters.",
      "string.max": "Password cannot exceed 100 characters.",
    }),
    phone: Joi.string()
      .pattern(/^[0-9]{10}$/)
      .optional(),
    preferredCurrency: Joi.string().optional(),
    timeZone: Joi.string().optional(),
  });

  return schema.validate(user);
};

export default validateUser;
