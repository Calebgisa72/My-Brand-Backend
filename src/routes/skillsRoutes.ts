import express from "express";
import skillsController from "../controllers/skillsController";
import { requireSignIn } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";

const router = express.Router();

router.post(
  "/",
  requireSignIn,
  upload.single("icon"),
  skillsController.createSkills
);

router.get("/", skillsController.getAllSkills);
router.put(
  "/:id",
  requireSignIn,
  upload.single("icon"),
  skillsController.updateSkillById
);
router.delete("/:id", requireSignIn, skillsController.deleteSkillById);

export default router;
