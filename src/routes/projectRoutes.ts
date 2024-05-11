import express from 'express';
import projController from '../controllers/projController';
import { requireSignIn } from '../middlewares/authMiddleware';
import upload from '../middlewares/multer';

const router = express.Router();

router.post('/project', requireSignIn, upload.single('pImage'), projController.postProj);

router.get('/projects', projController.getAllProjects);
router.get('/project/:id',projController.getProjById);
router.put('/project/:id', requireSignIn, projController.updateProjById);
router.delete('/project/:id', requireSignIn, projController.deleteProjById);

export default router;