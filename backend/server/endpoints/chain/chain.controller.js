import httpStatus from "http-status";
import moment from "moment";
import uuid from "uuid/v4";

import ChaincodeService from "../../services/chain.service";
import APIError from "../../utils/APIError";

const chaincodeService = new ChaincodeService();

// TODO don't hardcode users + functions

/**
 * Initializes the ledger
 * @property {string} req.body.user - The name of the user.
 * @property {string} req.body.function - The name of the function.
 * @property {array} req.body.funcArgs- An array of string arguments.
 * @returns {json}
 */
const query = async (req, res, next) => {
  const { funcName } = req.params;
  const funcArgs = req.body.funcArgs
    ? { ...req.body.funcArgs }
    : { funcArgs: "" };

  if (!funcName)
    return next(
      new APIError("Arguments missing", httpStatus.BAD_REQUEST, true)
    );

  try {
    const request = await chaincodeService.prepareRequest(
      "user4",
      funcName,
      Object.values(funcArgs),
      false
    );
    const initResult = await chaincodeService.query(request);
    return res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    return next(err);
  }
};

const invoke = async (req, res, next) => {
  // Important - order matters!!
  // TODO remove toString() after param validation
  const movement = {
    Key: uuid(),
    Timestamp: moment()
      .unix()
      .toString(),
    Location: req.body.location,
    Transporter: req.body.transporter,
    Holder: req.body.holder
  };

  try {
    const request = await chaincodeService.prepareRequest(
      "user4",
      "recordWatchMovement",
      Object.values(movement)
    );
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};

/*
const transfer = async (req, res, next) => {
  // Important - order matters!!
  // TODO remove toString() after param validation
  const movement = {
    Key: req.body.key.toString(),
    Holder: req.body.holder
  };

  try {
    const request = await chaincodeService.prepareRequest('user4',
    'changeWatchMovementHolder', Object.values(movement));
    const initResult = await chaincodeService.invoke(request);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};
*/

export default {
  query,
  invoke
};
