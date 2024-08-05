import express from "express";
import blogController from "../controllers/blogController";
import { requireSignIn } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/:id/comments", blogController.addComment);
router.get("/:id/comments", blogController.getComments);
router.delete(
  "/:blogId/comments/:commentIndex",
  requireSignIn,
  blogController.deleteComment
);

export default router;
