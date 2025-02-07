import Joi from "joi";

const bookingValidation = (data) => {
  const schema = Joi.object({
    userId: Joi.string().required(),
    eventId: Joi.string().required(),
    seats: Joi.number().min(1).required(),
    status: Joi.string().valid("confirmed", "pending", "canceled").default("pending"),
  });

  return schema.validate(data);
};

export default bookingValidation;
