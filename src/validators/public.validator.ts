import Joi = require("joi");

export const registrationDto = {
  body: Joi.object().keys({
    last_name: Joi.string().required(),
    first_name: Joi.string().required(),
    email: Joi.string().email().required()
  })
}

export const updateUserDto = {
  body: Joi.object().keys({
    last_name: Joi.string().required(),
    first_name: Joi.string().required(),
    email: Joi.string().email().required()
  })
}