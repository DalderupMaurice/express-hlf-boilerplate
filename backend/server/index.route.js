
import { Router } from 'express';
import expressQueueMw from 'express-queue';

import userRoutes from './endpoints/user/user.route';
import authRoutes from './endpoints/auth/auth.route';
import chainRoutes from './endpoints/chain/chain.route';

const router = Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/', (req, res) => res.send('OK'));

// mount user routes at /users
router.use('/api/users', userRoutes);

// mount auth routes at /auth
router.use('/api/auth', authRoutes);

// mount chaincode routes at /chain
router.use('/api/chain', chainRoutes, expressQueueMw({ activeLimit: 1 }));

export default router;
