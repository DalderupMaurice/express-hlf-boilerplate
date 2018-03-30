import httpStatus from 'http-status';

import ChaincodeService from '../../services/chain.service';
import APIError from '../../utils/APIError';

const chaincodeService = new ChaincodeService();

/**
 * Initializes the ledger
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
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
 * @returns {User}
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


export default {
  init,
  queryAll
};
