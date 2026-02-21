import { login, register } from '../controllers/auth.controller.js'
import express from 'express'
import rateLimiter from '../midlleware/rateLimiter.js'

const router = express.Router()

router.use(rateLimiter)

router.post("/register", register)
router.post("/login", login)

export default router;