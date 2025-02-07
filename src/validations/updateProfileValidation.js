import Joi from "joi";

const updateProfileValidation = (name,email, photoUrl) => {
  const profileSchema = Joi.object({
    name: Joi.string().min(2).max(50),
    email: Joi.string().email(),
    photoUrl: Joi.string().uri(),
  });

  return profileSchema.validate(name, email, photoUrl);
};

export default updateProfileValidation;
