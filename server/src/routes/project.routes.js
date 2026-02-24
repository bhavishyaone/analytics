import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {createProject,getProject,getProjectById} from '../controllers/project.controller.js'

const router = express.Router()
router.post("/",authMiddleware,createProject)
router.get("/",authMiddleware,getProject)
router.get("/:id",authMiddleware,getProjectById)


export default router;

