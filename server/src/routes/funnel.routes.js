import { getFunnel } from "../controllers/funnel.controller.js";
import authMiddleware from '../midlleware/auth.middleware.js'

import express from 'express'

const router = express.Router()


/**
 * @swagger
 * /api/funnel/{projectId}:
 *   post:
 *     summary: Calculate funnel conversion
 *     description: Returns how many users completed each step in order.
 *     tags:
 *       - Funnels
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: days
 *         schema:
 *           type: integer
 *           default: 30
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - steps
 *             properties:
 *               steps:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["page_view", "signup", "purchase"]
 *     responses:
 *       200:
 *         description: Step + count array showing dropoff
 *       400:
 *         description: Invalid steps array
 */
router.post("/:projectId",authMiddleware,getFunnel)


export default router
