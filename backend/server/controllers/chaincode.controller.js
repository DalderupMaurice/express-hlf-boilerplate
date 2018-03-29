import httpStatus from 'http-status';

import ChaincodeService from '../services/ChaincodeService';
import Logger from '../services/Log';
import APIError from '../utils/APIError';


const chaincodeService = new ChaincodeService();
const LABEL = 'REQ-CHAINCODE';

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const init = async (req, res, next) => {
  try {
    const initResult = await chaincodeService.invoke();
    Logger(LABEL).info(`What returns the init?? ==> ${initResult}`);
    res.json(initResult);
  } catch (e) {
    const err = new APIError(e.message, httpStatus.BAD_REQUEST, true);
    next(err);
  }
};


export default {
  init
};
