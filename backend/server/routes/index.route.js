
import { Router } from 'express';

import userRoutes from './user.route';
import authRoutes from './auth.route';
import chainRoutes from './chaincode.route';

const router = Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/api/users', userRoutes);

// mount auth routes at /auth
router.use('/api/auth', authRoutes);

// mount chaincode routes at /chain
router.use('/api/chain', chainRoutes);

export default router;
