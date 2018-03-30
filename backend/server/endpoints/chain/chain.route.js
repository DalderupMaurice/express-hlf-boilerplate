import { Router } from 'express';

import chainCtrl from './chain.controller';

const router = Router(); // eslint-disable-line new-cap

router.route('/init')
  /** GET /api/chain/init - Initialize the chaincode/ledger */
  .get(chainCtrl.init);


router.route('/query/all')
  /** GET /api/chain/query/all - Queries the complete ledger */
  .get(chainCtrl.queryAll);


router.route('/query')
/** GET /api/chain/query/all - Queries the complete ledger */
  .get(chainCtrl.queryAll);

export default router;


/*
get
initLedger

queryAllWatchMovement
queryWatchMovement

post
recordWatchMovement

update
changeWatchMovementHolder
 */
