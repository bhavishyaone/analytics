import express from 'express'
import { trackEvent ,batchTrackEvent} from '../controllers/event.controller.js'
import apiKeyMiddleware from '../midlleware/apiKey.middleware.js'
import rateLimit from 'express-rate-limit'

const rateLimiter = rateLimit({
    windowMs:1 * 60 * 1000,
    max:300,
    message: {
        message: 'Too many events sent. Please slow down and try again.',
    }
})



const router = express.Router()

router.use(rateLimiter)
router.use(apiKeyMiddleware)


/**
 * @swagger
 * /api/events/track:
 *   post:
 *     summary: Track a single event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *         description: Your project API key (from project settings, not JWT)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: button_clicked
 *               userId:
 *                 type: string
 *                 example: user_123
 *               properties:
 *                 type: object
 *                 example: { "button": "signup", "page": "/home" }
 *     responses:
 *       201:
 *         description: Event tracked
 *       401:
 *         description: Invalid API key
 *       413:
 *         description: Payload too large
 */
router.post("/track",trackEvent)



/**
 * @swagger
 * /api/events/batch:
 *   post:
 *     summary: Track multiple events in one request
 *     tags:
 *       - Events
 *     parameters:
 *       - in: header
 *         name: x-api-key
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - events
 *             properties:
 *               events:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: page_view
 *                     userId:
 *                       type: string
 *                       example: user_123
 *     responses:
 *       201:
 *         description: All events tracked
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid API key
 */
router.post("/batch",batchTrackEvent)

export default router;