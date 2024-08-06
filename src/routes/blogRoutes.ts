import express from "express";
import blogController from "../controllers/blogController";
import { requireSignIn } from "../middlewares/authMiddleware";
import upload from "../middlewares/multer";

const router = express.Router();

router.post(
  "/",
  requireSignIn,
  upload.single("bImage"),
  blogController.createBlog
);

router.get("/", blogController.getAllBlogs);
router.get("/:id", blogController.getBlogById);
router.put("/:id", requireSignIn, blogController.updateBlogById);
router.delete("/:id", requireSignIn, blogController.deleteBlogById);
router.post("/:id/like", blogController.likeBlog);
router.post("/:id/disLike", blogController.disLikeBlog);

export default router;
