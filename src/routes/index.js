import { Router } from 'express';
import routesTopic from './routesTopic.js';
import routesRole from './routesRole.js';
import routesPermission from './routesPermission.js';
import routesEvaluation from './routeEvaluation.js';
import routesInstructor from './routeInstructor.js';
import routesApprentice from './routeApprentice.js';

const router = Router();

router.use('/topic', routesTopic);
router.use('/role', routesRole);
router.use('/permission', routesPermission);
router.use('/evaluation', routesEvaluation);
router.use('/instructor', routesInstructor);
router.use('/apprentice', routesApprentice);


export default router;
