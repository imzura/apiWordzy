import { Router } from 'express';
import routesTopic from './routesTopic.js';
import routesRole from './routesRole.js';
import routesPermission from './routesPermission.js';

const router = Router();

router.use('/topic', routesTopic);
router.use('/role', routesRole);
router.use('/permission', routesPermission);

export default router;
