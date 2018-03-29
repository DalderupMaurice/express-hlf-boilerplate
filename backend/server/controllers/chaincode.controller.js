import ChaincodeService from '../services/ChaincodeService';
import Logger from '../services/Log';


const chaincodeService = new ChaincodeService();
const LABEL = 'REQ-CHAINCODE';

/**
 * Create new user
 * @property {string} req.body.username - The username of user.
 * @property {string} req.body.mobileNumber - The mobileNumber of user.
 * @returns {User}
 */
const init = async (req, res, next) => {
  const initResult = await chaincodeService.invoke().catch(e => next(e));
  Logger(LABEL).info(`What returns the init?? ==> ${initResult}`);
  res.json(initResult);
};


export default {
  init
};
