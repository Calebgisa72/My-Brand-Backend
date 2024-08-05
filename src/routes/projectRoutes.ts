import express from "express";
import projController from "../controllers/projController";
import { requireSignIn } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";

const router = express.Router();

router.post(
  "/",
  requireSignIn,
  upload.single("pImage"),
  projController.postProj
);

router.get("/", projController.getAllProjects);
router.get("/:id", projController.getProjById);
router.put(
  "/:id",
  requireSignIn,
  upload.single("pImage"),
  projController.updateProjById
);
router.delete("/:id", requireSignIn, projController.deleteProjById);

export default router;
