import httpStatus from 'http-status';
import moment from 'moment';
import uuid from 'uuid/v4';

import ChaincodeService from '../../services/chain.service';
import APIError from '../../utils/APIError';

const chaincodeService = new ChaincodeService();

// TODO don't hardcode users + functions

/**
 * Initializes the ledger
 * @returns {Transaction}
 */
const init = async (req, res, next) => {
  try {
    const request = await chaincodeService.prepareRequest('user4', 'initLedger', ['']);
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

/**
 * Initializes the ledger
 * @property {string} req.body.user - The name of the user.
 * @property {string} req.body.function - The name of the function.
 * @property {array} req.body.funcArgs- An array of string arguments.
 * @returns {json}
 */
const queryAll = async (req, res, next) => {
  try {
    const request = await chaincodeService.prepareRequest('user4', 'queryAllWatchMovement', [''], false);
    const initResult = await chaincodeService.query(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

const queryByArgs = async (req, res, next) => {
  const funcArgs = req.param('id');
  if (!funcArgs) return next(new APIError('Arguments missing', httpStatus.BAD_REQUEST, true));

  try {
    const request = await chaincodeService.prepareRequest('user4', 'queryWatchMovement', [funcArgs], false);
    const initResult = await chaincodeService.query(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

const add = async (req, res, next) => {
  // Important - order matters!!
  // TODO remove toString() after param validation
  // Transporter: args[1], Location: args[2], Timestamp: args[3], Holder: args[4]
  const movement = {
    Key: uuid(),
    Transporter: req.body.transporter,
    Location: req.body.location,
    Timestamp: moment().unix().toString(),
    Holder: req.body.holder
  };


  try {
    const request = await chaincodeService.prepareRequest('user4', 'recordWatchMovement', Object.values(movement));
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

const transfer = async (req, res, next) => {
  // Important - order matters!!
  // TODO remove toString() after param validation
  const movement = {
    Key: req.body.key.toString(),
    Holder: req.body.holder
  };

  try {
    const request = await chaincodeService.prepareRequest('user4', 'changeWatchMovementHolder', Object.values(movement));
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};


export default {
  init,
  queryAll,
  queryByArgs,
  add,
  transfer
};
