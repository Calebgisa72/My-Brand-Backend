import express from 'express';
import blogController from '../controllers/blogController';
import { requireSignIn } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/blogs/:id/comments', blogController.addComment);
router.get('/blogs/:id/comments', blogController.getComments);
router.delete('/blogs/:blogId/comments/:commentIndex', requireSignIn, blogController.deleteComment);

export default router;
