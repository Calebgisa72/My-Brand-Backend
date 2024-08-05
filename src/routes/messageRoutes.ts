import express from 'express';
import messageController from '../controllers/messageController';
import { requireSignIn } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/', messageController.sendMessage);
router.get('/', requireSignIn, messageController.getAllMessages);
router.delete('/:id', requireSignIn, messageController.deleteMessage);

export default router;