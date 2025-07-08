import express from 'express';
import rankingController from '../controllers/rankingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validateRequest.js';
import { rankingValidators } from '../validators/rankingValidator.js';

const router = express.Router();

// Aplicar middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Rutas de ranking
router.get('/students', 
  rankingValidators.getStudentRanking, 
  validateRequest, 
  rankingController.getStudentRanking
);

router.get('/metrics', 
  rankingValidators.getRankingMetrics, 
  validateRequest, 
  rankingController.getRankingMetrics
);

router.get('/students/program/:programId', 
  rankingValidators.getStudentsByProgram, 
  validateRequest, 
  rankingController.getStudentsByProgram
);

router.get('/students/course/:courseId', 
  rankingValidators.getStudentsByCourse, 
  validateRequest, 
  rankingController.getStudentsByCourse
);

router.get('/student/:studentId/position', 
  rankingValidators.getStudentRankingPosition, 
  validateRequest, 
  rankingController.getStudentRankingPosition
);

router.get('/ficha/:fichaId/stats', 
  rankingValidators.getFichaProgressStats, 
  validateRequest, 
  rankingController.getFichaProgressStats
);

export default router;