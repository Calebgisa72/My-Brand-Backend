import express from 'express';
import blogController from '../controllers/blogController';
import { requireSignIn } from '../middlewares/authMiddleware';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment management APIs
 */

// Add a comment to a blog
/**
 * @swagger
 * /blogs/{id}/comments:
 *   post:
 *     summary: Add a comment to a blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog to add the comment to
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *             required:
 *               - comment
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
router.post('/blogs/:id/comments', requireSignIn, blogController.addComment);

// Get comments of a blog
/**
 * @swagger
 * /blogs/{id}/comments:
 *   get:
 *     summary: Get comments of a blog
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the blog to get comments from
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comments retrieved successfully
 */
router.get('/blogs/:id/comments', blogController.getComments);

// Delete a comment from a blog
/**
 * @swagger
 * /blogs/{blogId}/comments/{commentIndex}:
 *   delete:
 *     summary: Delete a comment from a blog
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: blogId
 *         required: true
 *         description: ID of the blog
 *         schema:
 *           type: string
 *       - in: path
 *         name: commentIndex
 *         required: true
 *         description: Index of the comment to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 */
router.delete('/blogs/:blogId/comments/:commentIndex', requireSignIn, blogController.deleteComment);

export default router;
