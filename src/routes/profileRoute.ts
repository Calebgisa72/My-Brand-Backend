import express from 'express';
import { updateCv } from '../controllers/profileController';
import { requireSignIn } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';


const router = express.Router();

router.post('/updateCv/:id', requireSignIn, upload.single('cv'),updateCv);


export default router;