import express from 'express'
import cors from 'cors'
import { trackEvent ,batchTrackEvent,getEventsByProject} from '../controllers/event.controller.js'
import apiKeyMiddleware from '../midlleware/apiKey.middleware.js'
import rateLimit from 'express-rate-limit'
import authMiddleware from '../midlleware/auth.middleware.js'

const rateLimiter = rateLimit({
    windowMs:1 * 60 * 1000,
    max:300,
    message: {
        message: 'Too many events sent. Please slow down and try again.',
    }
})


const openCors = cors({ origin: '*' })

const router = express.Router()

router.use(rateLimiter)

router.get('/:projectId', authMiddleware, getEventsByProject)


router.use(apiKeyMiddleware)


router.post("/track", openCors, trackEvent)



router.post("/batch", openCors, batchTrackEvent)

export default router;