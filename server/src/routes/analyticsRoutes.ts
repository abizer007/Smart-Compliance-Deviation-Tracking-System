import { Router } from 'express';
import { authenticateJWT } from '../middleware/auth';
import * as analyticsService from '../services/analyticsService';

const router = Router();

router.use(authenticateJWT);

router.get('/overview', analyticsService.overview);

export default router;

