import httpStatus from 'http-status';

import Joi from 'joi';
import APIError from '../utils/APIError';

const validate = (req, rules = {}) => {
  const toSchema = rule => {
    // If a Joi rule is provided, use it.
    if (rule && rule.isJoi) {
      return rule;
    }
    // Otherwise, assume it is an object, wrap in object.keys() validator.
    // Unless if it's null, validate an empty object.
    return Joi.object().keys(rule || {});
  };
    // Utility to convert array of Joi errors of form {message, path, type, context} to
    // an object of form {path: type}.
  const errorConverter = joiDetails => joiDetails.reduce((acc, curr) =>
    Object.assign({}, acc, { [curr.path]: { type: curr.type, message: curr.message } }), {});
    // Validation options. Return all errors (abortEarly) and don't autocast
    // values to the required types! Consider everything required by default.
  const validationOptions = {
    abortEarly: false,
    convert: false,
    presence: 'required',
  };
    // Aggregate error details herein.
  const errorData = {};
  // Validate params
  const { error: paramError } = Joi.validate(
    req.params || {},
    toSchema(rules.params),
    validationOptions
  );
  if (paramError) {
    errorData.paramErrors = errorConverter(paramError.details);
  }
  // Validate body
  const { error: bodyError } = Joi.validate(
    req.body || {},
    toSchema(rules.body),
    validationOptions
  );
  if (bodyError) {
    errorData.bodyErrors = errorConverter(bodyError.details);
  }
  // Validate query
  const { error: queryError } = Joi.validate(
    req.query || {},
    toSchema(rules.query),
    validationOptions
  );
  if (queryError) {
    errorData.queryErrors = errorConverter(queryError.details);
  }
  // If there was an error, return a rejecting promise with the 400 request body
  if (Object.keys(errorData).length > 0) {
    return Promise.reject(new APIError(errorData, httpStatus.BAD_REQUEST));
  }
  // Otherwise, we're done.
  return Promise.resolve(req);
};

export default validate;
