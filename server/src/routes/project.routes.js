import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {createProject,getProject,getProjectById,deleteProjectByID,rotateApiKey} from '../controllers/project.controller.js'

const router = express.Router()
router.post("/",authMiddleware,createProject)
router.get("/",authMiddleware,getProject)
router.get("/:id",authMiddleware,getProjectById)
router.delete('/:id', authMiddleware, deleteProjectByID);
router.patch("/:id/rotate-key", authMiddleware, rotateApiKey);

export default router;

