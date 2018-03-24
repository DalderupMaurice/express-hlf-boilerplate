'use strict';
import { Router } from 'express';

import userRoutes from './server/user/user.route';
import authRoutes from './server/auth/auth.route';

const router = Router(); // eslint-disable-line new-cap

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  return res.send('OK');
});

// mount user routes at /users
router.use('/users', userRoutes);

// mount auth routes at /auth
router.use('/auth', authRoutes);

export default router;
