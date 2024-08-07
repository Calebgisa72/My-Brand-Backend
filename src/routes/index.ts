import { Router } from "express";
import authRoutes from "./authRoutes";
import blogRoutes from "./blogRoutes";
import messageRoutes from "./messageRoutes";
import commentRoutes from "./commentRoutes";
import profileRoutes from "./profileRoutes";
import projectRoutes from "./projectRoutes";
import skillRoutes from "./skillsRoutes";

const router = Router();

router.use(
  "/blogs",
  blogRoutes
  /*
  #swagger.tags = ['BLOG']
  */
);

router.use(
  "/auth",
  authRoutes
  /*
  #swagger.tags = ['USER']
  */
);

router.use(
  "/blogs",
  commentRoutes
  /*
  #swagger.tags = ['COMMENT']
  */
);

router.use(
  "/skills",
  skillRoutes
  /*
  #swagger.tags = ['SKILL']
  */
);

router.use(
  "/profile",
  profileRoutes
  /*
  #swagger.tags = ['PROFILE']
  */
);

router.use(
  "/project",
  projectRoutes
  /*
  #swagger.tags = ['PROJECT']
  */
);

router.use(
  "/message",
  messageRoutes
  /*
  #swagger.tags = ['Massages']
  */
);

export default router;
