import { Router } from 'express';
import routesTopic from './routesTopic.js';
import routesRole from './routesRole.js';
import routesPermission from './routesPermission.js';
import routesPrivilege from './routesPrivilege.js';

const router = Router();

router.use('/topic', routesTopic);
router.use('/role', routesRole);
router.use('/permission', routesPermission);
router.use('/privilege', routesPrivilege);

export default router;
