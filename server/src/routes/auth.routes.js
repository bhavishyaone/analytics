import { login, register, getMe, updateMe, googleLogin } from '../controllers/auth.controller.js'
import express from 'express'
import rateLimiter from '../midlleware/rateLimiter.js'
import authMiddleware from '../midlleware/auth.middleware.js'

const router = express.Router()

router.use(rateLimiter)


router.post("/register", register)
router.post("/google", googleLogin)
router.post("/login", login)


router.get('/me', authMiddleware, getMe)


router.patch('/me', authMiddleware, updateMe)

export default router;