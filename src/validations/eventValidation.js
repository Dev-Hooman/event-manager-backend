import Joi from "joi";

const eventValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.date().required(),
    time: Joi.string().required(),
    location: Joi.string().required(),
    category: Joi.string().required(),
    price: Joi.number().required(),
    availableSeats: Joi.number().required(),
  });

  return schema.validate(data);
};

export default eventValidation;
