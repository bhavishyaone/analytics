import express from 'express'
import { trackEvent } from '../controllers/event.controller.js'
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

router.post("/track",trackEvent)

export default router;