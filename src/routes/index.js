import { Router } from 'express';
import routesTopic from './routesTopic.js';
import routesRole from './routesRole.js';
import routesPermission from './routesPermission.js';
import routesEvaluation from './routeEvaluation.js';
import routesInstructor from './routeInstructor.js';
import routesApprentice from './routeApprentice.js';
import routesCoursePrograming from './routesCourseProgramming.js';
import routesProgram from './routesProgram.js';
import routesSupportMaterial from './supportMaterialRoutes.js';
import routesUpload from './uploadRoutes.js';


const router = Router();

router.use('/topic', routesTopic);
router.use('/role', routesRole);
router.use('/permission', routesPermission);
router.use('/evaluation', routesEvaluation);
router.use('/instructor', routesInstructor);
router.use('/apprentice', routesApprentice);
router.use('/course-programming', routesCoursePrograming)
router.use('/program', routesProgram);
router.use('/support-materials', routesSupportMaterial);
router.use('/upload', routesUpload);


export default router;
