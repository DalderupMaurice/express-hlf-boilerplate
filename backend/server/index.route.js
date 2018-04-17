import { Router } from 'express';

import userRoutes from './endpoints/user/user.route';
import authRoutes from './endpoints/auth/auth.route';
import chainRoutes from './endpoints/chain/chain.route';
import movementRoutes from './endpoints/movement/movement.route';

export default Router()
  .get('/', (req, res) => res.send('OK')) /** GET /health-check - Check service health */
  .use('/api/users', userRoutes) // mount user routes at /users
  .use('/api/auth', authRoutes) // mount auth routes at /auth
  .use('/api/chain', chainRoutes) // mount chaincode routes at /chain
  .use('/api/movement', movementRoutes); // mount movement routes at /movement

