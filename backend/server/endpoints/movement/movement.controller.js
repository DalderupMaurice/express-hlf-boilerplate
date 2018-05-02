import ChaincodeService from "../../services/chain.service";
import validate from "../../services/validate.service";
import { getOneSchema, addSchema, updateSchema } from "./movement.validation";
import { addRequestToArgs, getOneRequestToArgs, updateRequestToArgs } from "./movement.model";

const INIT_LEDGER = "initLedger";
const ADD_MOVEMENT = "recordWatchMovement";
const QUERY_ONE_MOVEMENT = "queryWatchMovement";
const QUERY_ALL_MOVEMENT = "queryAllWatchMovement";
const CHANGE_MOVEMENT_HOLDER = "changeWatchMovementHolder";

const chaincodeService = new ChaincodeService();

// TODO don't hardcode users + functions

/**
 * Initializes the ledger
 * @returns {Transaction}
 */
const init = async (req, res, next) => {
  try {
    const chaincodeRequest = await chaincodeService.prepareRequest(req, INIT_LEDGER, [""]);
    const initResult = await chaincodeService.invoke(chaincodeRequest);
    res.json(initResult);
  } catch (e) {
    next(e);
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
    const chaincodeRequest = await chaincodeService.prepareRequest(req, QUERY_ALL_MOVEMENT, [""], false);
    const initResult = await chaincodeService.query(chaincodeRequest);
    res.json(initResult);
  } catch (e) {
    next(e);
  }
};

const queryByArgs = async (req, res, next) => {
  try {
    const validatedAPIRequest = await validate(req, getOneSchema);
    const args = getOneRequestToArgs(validatedAPIRequest);
    const chaincodeRequest = await chaincodeService.prepareRequest(req, QUERY_ONE_MOVEMENT, args, false);
    const initResult = await chaincodeService.query(chaincodeRequest);
    res.json(initResult);
  } catch (e) {
    next(e);
  }
};

const add = async (req, res, next) => {
  try {
    const validatedAPIRequest = await validate(req, addSchema);
    const args = addRequestToArgs(validatedAPIRequest);
    const chaincodeRequest = await chaincodeService.prepareRequest(req, ADD_MOVEMENT, args);
    const initResult = await chaincodeService.invoke(chaincodeRequest);
    res.json(initResult);
  } catch (e) {
    next(e);
  }
};

const transfer = async (req, res, next) => {
  try {
    const validatedAPIRequest = await validate(req, updateSchema);
    const args = updateRequestToArgs(validatedAPIRequest);
    const chaincodeRequest = await chaincodeService.prepareRequest(req, CHANGE_MOVEMENT_HOLDER, args);
    const initResult = await chaincodeService.invoke(chaincodeRequest);
    res.json(initResult);
  } catch (e) {
    next(e);
  }
};

export { init, queryAll, queryByArgs, add, transfer };
