import Joi from "joi";

const username = Joi.string().required();
const password = Joi.string().required();

const loginSchema = {
  body: {
    username,
    password
  }
};

export { loginSchema }; // eslint-disable-line
