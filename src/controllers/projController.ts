import { Request, Response } from "express";
import Project, { IProj } from "../models/projects";
import cloudinary from "../services/cloudinary";
import { projectSchema } from "../utils/validation";

class projController {
  //post new project
  async postProj(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Project Image file is required" });
        return;
      }

      const startDate = new Date(req.body.pStartDate);

      const validation = projectSchema.safeParse({
        ...req.body,
        ...req.file.path,
        pStartDate: startDate,
      });
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.errors,
        });
        return;
      }

      const {
        pTitle,
        pTechnologies,
        pShortDesc,
        pLongDesc,
        pStartDate,
        pEndDate,
        pLink,
      } = req.body;

      const result = await cloudinary.uploader.upload(req.file.path);

      const newProject = new Project({
        pImage: result.secure_url,
        pTitle,
        pTechnologies,
        pShortDesc,
        pLongDesc,
        pStartDate,
        pLink,
        pEndDate,
      });
      await newProject.save();
      res
        .status(201)
        .json({ message: "Created project Successfully", newProject });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    }
  }

  //Get all projects
  async getAllProjects(req: Request, res: Response): Promise<void> {
    try {
      const Projects: IProj[] = await Project.find();
      res.status(200).json({ data: Projects });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get a specific Project
  async getProjById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const proj = await Project.findById(id);
      if (!proj) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json(proj);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  async updateProjById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;

      const startDate = new Date(req.body.pStartDate);

      const validation = projectSchema.safeParse({
        ...req.body,
        pStartDate: startDate,
      });
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.errors,
        });
        return;
      }

      const {
        pImage,
        pTitle,
        pTechnologies,
        pShortDesc,
        pLongDesc,
        pStartDate,
        pEndDate,
        pLink,
      } = req.body;

      const updatedProject: IProj | null = await Project.findByIdAndUpdate(
        id,
        {
          pImage,
          pTitle,
          pTechnologies,
          pShortDesc,
          pLongDesc,
          pStartDate,
          pEndDate,
          pLink,
        },
        { new: true }
      );

      if (!updatedProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json(updatedProject);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  // Delete a Project by ID
  async deleteProjById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const deletedProject = await Project.findByIdAndDelete(id);
      if (!deletedProject) {
        res.status(404).json({ message: "Project not found" });
        return;
      }
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new projController();
