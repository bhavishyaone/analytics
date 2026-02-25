import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {getOverview,getEventsOverTime} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get("/:projectId/overview",authMiddleware,getOverview)
router.get('/:projectId/events-over-time',authMiddleware, getEventsOverTime);
export default router