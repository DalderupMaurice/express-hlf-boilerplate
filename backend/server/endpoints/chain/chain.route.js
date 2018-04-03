import { Router } from 'express';

import chainCtrl from './chain.controller';

const router = Router(); // eslint-disable-line new-cap


/**
 * @function initLedger
 * @function recordWatchMovement
 *           @property {string} req.body.funcArgs[0] - The id of the watchmovement.
 *           @property {string} req.body.funcArgs[1] - The Transporter.
 *           @property {string} req.body.funcArgs[2] - The location.
 *           @property {string} req.body.funcArgs[3] - The timestamp
 *           @property {string} req.body.funcArgs[4] - The holder.
 * @function changeWatchMovementHolder
 *           @property {string} req.body.funcArgs[0] - The id of the watchmovement.
 *           @property {string} req.body.funcArgs[1] - The new holder.
 */
router.route('/invoke/:funcName')
  /** POST /api/chain/invoke/:funcName - Invoke a function (args optional) */
  .post(chainCtrl.invoke);


/**
 * @function queryAllWatchMovement
 * @function queryWatchMovement
 *           @property {string} req.body.funcArgs[0] - The id of the watchmovement.
 */
router.route('/query/:funcName')
  /** POST /api/chain/query/:funcName - Query the ledger (args optional) */
  .post(chainCtrl.query);


// TODO load and dynamic param validation


export default router;
