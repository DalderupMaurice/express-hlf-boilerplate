import Joi from 'joi';

const key = Joi.string().uuid();
const transporter = Joi.string();
const location = Joi.string();
const holder = Joi.string();

export const getOneSchema = {
  params: {
    key
  }
};

export const addSchema = {
  body: {
    transporter,
    location,
    holder
  }
};

export const updateSchema = {
  body: {
    key,
    holder
  }
};
