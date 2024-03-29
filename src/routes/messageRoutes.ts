import express from 'express';
import messageController from '../controllers/messageController';
import { requireSignIn } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/message', messageController.sendMessage);
router.get('/message', messageController.getAllMessages);
router.delete('/message/:id', requireSignIn, messageController.deleteMessage);

export default router;