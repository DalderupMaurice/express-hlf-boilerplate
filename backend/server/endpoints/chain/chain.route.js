import { Router } from 'express';

import chainCtrl from './chain.controller';

const router = Router(); // eslint-disable-line new-cap

router.route('/init')
  /** GET /api/chain/init - Initialize the chaincode/ledger */
  .get(chainCtrl.init);


// TODO param validation
router.route('/add')
  /** GET /api/chain/add - Adds an object to the ledger */
  .post(chainCtrl.add);


router.route('/query/all')
  /** GET /api/chain/query/all - Queries the complete ledger */
  .get(chainCtrl.queryAll);


// TODO param validation
router.route('/query/:id')
  /** GET /api/chain/query/:id - Queries the ledger by Id */
  .get(chainCtrl.queryByArgs);


export default router;


/*

  app.get('/add_watchmovement/:watchmovement', function(req, res){
    watchmovement.add_watchmovement(req, res);
  });
  app.get('/get_all_watchmovement', function(req, res){
    watchmovement.get_all_watchmovement(req, res);
  });
  app.get('/change_holder/:holder', function(req, res){
    watchmovement.change_holder(req, res);
  });
 */

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
