import express from 'express';
import { getFunnel, saveFunnel, listFunnels, removeFunnel } from '../controllers/funnel.controller.js';
import authMiddleware from '../midlleware/auth.middleware.js';

const router = express.Router();


router.post('/', authMiddleware, saveFunnel);


router.get('/', authMiddleware, listFunnels);


router.delete('/:funnelId', authMiddleware, removeFunnel);


router.post('/:projectId/run', authMiddleware, getFunnel);


export default router;
