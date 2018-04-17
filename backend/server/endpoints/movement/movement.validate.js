import Joi from 'joi';

const key = Joi.string().uuid();
const transporter = Joi.string();
const location = Joi.string();
const holder = Joi.string();

const getOneSchema = {
  params: {
    key
  }
};

const addSchema = {
  body: {
    transporter,
    location,
    holder
  }
};

const updateSchema = {
  body: {
    key,
    holder
  }
};

export {
  getOneSchema,
  addSchema,
  updateSchema
};
