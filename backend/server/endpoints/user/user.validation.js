import Joi from "joi";

const userId = Joi.string()
  .hex()
  .required();
const username = Joi.string().required();
const password = Joi.string().required();
const enrollmentSecret = Joi.string().required();

const createSchema = {
  body: {
    username,
    password,
    enrollmentSecret
  }
};

const updateSchema = {
  body: {
    username,
    password,
    enrollmentSecret
  },
  params: {
    userId
  }
};

export { createSchema, updateSchema };
