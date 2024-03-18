import express from 'express';
import blogController from '../controllers/blogController';
import { requireSignIn } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';

const router = express.Router();

router.post('/blogs', requireSignIn, upload.single('bImage') ,blogController.createBlog);

router.get('/blogs', requireSignIn, blogController.getAllBlogs);

router.get('/blogs/:id', requireSignIn, blogController.getBlogById);

router.put('/blogs/:id', requireSignIn, blogController.updateBlogById);

router.delete('/blogs/:id', requireSignIn, blogController.deleteBlogById);

router.post('/blogs/:id/like', blogController.likeBlog);

export default router;
