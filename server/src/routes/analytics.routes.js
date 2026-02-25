import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {getOverview} from '../controllers/analytics.controller.js'

const router = express.Router()

router.get("/:projectId/overview",authMiddleware,getOverview)
export default router