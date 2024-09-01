import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";
import profileController from "../controllers/profileController";

const router = express.Router();

router.post(
  "/",
  requireSignIn,
  profileController.updateProfile
);
router.get("/", profileController.getProfile);

export default router;
