import express from 'express'
import authMiddleware from '../midlleware/auth.middleware.js'
import {createProject,getProject,getProjectById,deleteProjectByID,rotateApiKey} from '../controllers/project.controller.js'

const router = express.Router()


/**
 * @swagger
 * /api/projects:
 *   post:
 *     summary: Create a new project
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
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
 *                 example: My Bookstore App
 *     responses:
 *       201:
 *         description: Project created with API key
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 */
router.post("/",authMiddleware,createProject)


/**
 * @swagger
 * /api/projects:
 *   get:
 *     summary: Get all projects for the logged-in user
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of projects
 *       401:
 *         description: Not authenticated
 */
router.get("/",authMiddleware,getProject)


/**
 * @swagger
 * /api/projects/{id}:
 *   get:
 *     summary: Get a single project by ID
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 */
router.get("/:id",authMiddleware,getProjectById)


/**
 * @swagger
 * /api/projects/{id}:
 *   delete:
 *     summary: Delete a project by ID
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Project deleted
 *       404:
 *         description: Project not found
 */
router.delete('/:id', authMiddleware, deleteProjectByID);


/**
 * @swagger
 * /api/projects/{id}/rotate-key:
 *   patch:
 *     summary: Rotate the API key for a project
 *     tags:
 *       - Projects
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: New API key returned
 *       404:
 *         description: Project not found
 */
router.patch("/:id/rotate-key", authMiddleware, rotateApiKey);

export default router;

