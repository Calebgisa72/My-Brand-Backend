import express from 'express';
import blogController from '../controllers/blogController';
import { requireSignIn } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Blog
 *   description: Blog management APIs
 */

// Create a new blog
/**
 * @swagger
 * /blogs:
 *   post:
 *     summary: Create a new blog
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBlog'
 *     responses:
 *       200:
 *         description: Blog created successfully
 */
router.post('/blogs', requireSignIn, upload.single('bImage'), blogController.createBlog);

// Get all blogs
router.get('/blogs', requireSignIn, blogController.getAllBlogs);

// Get blog by ID
router.get('/blogs/:id', requireSignIn, blogController.getBlogById);

// Update blog by ID
router.put('/blogs/:id', requireSignIn, blogController.updateBlogById);

// Delete blog by ID
router.delete('/blogs/:id', requireSignIn, blogController.deleteBlogById);

// Like a blog
router.post('/blogs/:id/like', blogController.likeBlog);

export default router;
