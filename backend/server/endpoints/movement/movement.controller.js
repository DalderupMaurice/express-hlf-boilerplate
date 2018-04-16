import httpStatus from 'http-status';

import ChaincodeService from '../../services/chain.service';
import APIError from '../../utils/APIError';

import { validate } from '../../services/validate.service';

import { getOneSchema, addSchema, updateSchema } from './movement.validate';
import { addRequestToArgs, getOneRequestToArgs, updateRequestToArgs } from './movement.model';

const chaincodeService = new ChaincodeService();

const INIT_LEDGER = 'initLedger';
const ADD_MOVEMENT = 'recordWatchMovement';
const QUERY_ONE_MOVEMENT = 'queryWatchMovement';
const QUERY_ALL_MOVEMENT = 'queryAllWatchMovement';
const CHANGE_MOVEMENT_HOLDER = 'changeWatchMovementHolder';

// TODO don't hardcode users + functions

/**
 * Initializes the ledger
 * @returns {Transaction}
 */
const init = async (req, res, next) => {
  try {
    const request = await chaincodeService.prepareRequest('user4', INIT_LEDGER, ['']);
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

/**
 * Get all movements
 * @property {string} req.body.user - The name of the user.
 * @property {string} req.body.function - The name of the function.
 * @property {array} req.body.funcArgs- An array of string arguments.
 * @returns {json}
 */
const queryAll = async (req, res, next) => {
  try {
    const request = await chaincodeService.prepareRequest('user4', QUERY_ALL_MOVEMENT, [''], false);
    const initResult = await chaincodeService.query(request);
    res.json(initResult);
  } catch (e) {
    next(new APIError(e.data, httpStatus.BAD_REQUEST, true));
  }
};

const queryByArgs = async (req, res, next) => {
  try {
    const validatedRequest = await validate(req, getOneSchema);
    const request = await chaincodeService.prepareRequest('user4', QUERY_ONE_MOVEMENT, getOneRequestToArgs(validatedRequest), false);
    const initResult = await chaincodeService.query(request);
    res.json(initResult);
  } catch (e) {
    next(new APIError(e.data, httpStatus.BAD_REQUEST, true));
  }
};

const add = async (req, res, next) => {
  try {
    const validatedRequest = await validate(req, addSchema);
    const request = await chaincodeService.prepareRequest('user4', ADD_MOVEMENT, addRequestToArgs(validatedRequest));
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    next(new APIError(e.data, httpStatus.BAD_REQUEST, true));
  }
};

const transfer = async (req, res, next) => {
  try {
    const validatedRequest = await validate(req, updateSchema);
    const request = await chaincodeService.prepareRequest('user4', CHANGE_MOVEMENT_HOLDER, updateRequestToArgs(validatedRequest));
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    next(new APIError(e.message, httpStatus.BAD_REQUEST, true));
  }
};

export default {
  init,
  queryAll,
  queryByArgs,
  add,
  transfer
};
