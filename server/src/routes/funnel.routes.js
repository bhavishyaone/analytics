import { getFunnel } from "../controllers/funnel.controller.js";
import authMiddleware from '../midlleware/auth.middleware.js'

import express from 'express'

const router = express.Router()

router.post("/:projectId",authMiddleware,getFunnel)

export default router
