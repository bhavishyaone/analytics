import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {getOverview,getEventsOverTime,getTopEvents,getActiveUser} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get("/:projectId/overview",authMiddleware,getOverview)
router.get('/:projectId/events-over-time',authMiddleware, getEventsOverTime);
router.get("/:projectId/top-events",authMiddleware,getTopEvents)
router.get("/:projectId/active-users",authMiddleware,getActiveUser)
export default router

