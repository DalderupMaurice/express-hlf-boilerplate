import Joi from "joi";

const userId = Joi.string()
  .hex()
  .required();
const username = Joi.string().required();
const password = Joi.string().required();
const enrollmentSecret = Joi.string().required();

export const createSchema = {
  body: {
    username,
    password,
    enrollmentSecret
  }
};

export const updateSchema = {
  body: {
    username,
    password,
    enrollmentSecret
  },
  params: {
    userId
  }
};

export const loginSchema = {
  body: {
    username,
    password
  }
};
