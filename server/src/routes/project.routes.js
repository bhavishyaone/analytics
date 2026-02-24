import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {createProject} from '../controllers/project.controller.js'

const router = express.Router()
router.post("/",authMiddleware,createProject)


export default router;

