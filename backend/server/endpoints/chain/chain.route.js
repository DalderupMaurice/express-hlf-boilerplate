import { Router } from 'express';

import chainCtrl from './chain.controller';

const router = Router(); // eslint-disable-line new-cap


router.route('/invoke/:funcName')
  /** POST /api/chain/invoke/:funcName - Invoke a function (args optional) */
  .post(chainCtrl.invoke);


router.route('/query/:funcName')
  /** POST /api/chain/query/:funcName - Query the ledger (args optional) */
  .post(chainCtrl.query);


// TODO load and dynamic param validation


export default router;
