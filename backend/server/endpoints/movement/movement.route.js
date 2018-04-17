import { Router } from 'express';

import { init, queryAll, queryByArgs, add, transfer } from './movement.controller';

const router = Router();

router
  .route('/init')
  .get(init);

router
  .route('/query/all')
  .get(queryAll);

router
  .route('/query/:key')
  .get(queryByArgs);

router
  .route('/add')
  .post(add);

router
  .route('/update')
  .put(transfer);

export default router;
