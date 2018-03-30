import { Router } from 'express';

import chainCtrl from './chain.controller';

const router = Router(); // eslint-disable-line new-cap

router.route('/init')
  /** GET /api/chain/init - Initialize the chaincode/ledger */
  .get(chainCtrl.init);

router.route('/query')
  /** GET /api/chain/query - Queries the complete ledger */
  .get(chainCtrl.queryAll);

export default router;
