import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {getOverview,getEventsOverTime,getTopEvents,getActiveUser,getRetention} from '../controllers/analytics.controller.js'

const router = express.Router()

/**
 * @swagger
 * /api/analytics/{projectId}/overview:
 *   get:
 *     summary: Get overview stats — total events and unique users
 *     tags:
 *       - Analytics
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
 *     responses:
 *       200:
 *         description: Total events, unique users, period
 */
router.get("/:projectId/overview",authMiddleware,getOverview)


/**
 * @swagger
 * /api/analytics/{projectId}/events-over-time:
 *   get:
 *     summary: Get daily event counts over time
 *     tags:
 *       - Analytics
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
 *     responses:
 *       200:
 *         description: Array of date + count pairs
 */
router.get('/:projectId/events-over-time',authMiddleware, getEventsOverTime);


/**
 * @swagger
 * /api/analytics/{projectId}/top-events:
 *   get:
 *     summary: Get the top 10 most fired events
 *     tags:
 *       - Analytics
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
 *     responses:
 *       200:
 *         description: Array of event name + count
 */
router.get("/:projectId/top-events",authMiddleware,getTopEvents)


/**
 * @swagger
 * /api/analytics/{projectId}/active-users:
 *   get:
 *     summary: Get DAU, WAU, MAU counts
 *     tags:
 *       - Analytics
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Returns dau, wau, mau
 */
router.get("/:projectId/active-users",authMiddleware,getActiveUser)


/**
 * @swagger
 * /api/analytics/{projectId}/retention:
 *   get:
 *     summary: Get weekly cohort retention
 *     tags:
 *       - Analytics
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
 *           default: 90
 *     responses:
 *       200:
 *         description: Cohort retention — day1, day7, day14, day30
 */
router.get('/:projectId/retention', authMiddleware, getRetention);

export default router

