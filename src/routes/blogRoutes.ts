import express from 'express';
import blogController from '../controllers/blogController';
import { requireSignIn } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';

const router = express.Router();

router.post('/blogs', requireSignIn, upload.single('bImage'), blogController.createBlog);

router.get('/blogs', blogController.getAllBlogs);
router.get('/blogs/:id',blogController.getBlogById);
router.put('/blogs/:id', requireSignIn, blogController.updateBlogById);
router.delete('/blogs/:id', requireSignIn, blogController.deleteBlogById);
router.post('/blogs/:id/like', blogController.likeBlog);
router.post('/blogs/:id/disLike', blogController.disLikeBlog);

export default router;
