import { Request, Response } from "express";
import cloudinary from "../services/cloudinary";
import Skill, { SkillProps } from "../models/skills";
import { skillSchema } from "../utils/validation";

class SkillController {
  // Create skill
  async createSkills(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ message: "Skill icon is required" });
        return;
      }

      const learnt = new Date(req.body.learntDate);

      const validation = skillSchema.safeParse({
        ...req.body,
        learntDate: learnt,
      });
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.errors,
        });
        return;
      }

      const {
        title,
        learntDate,
        proficiency,
        shortDescription,
        relatedLibraries,
        color,
      } = req.body;

      const parsedLearntDate = new Date(learntDate);

      const result = await cloudinary.uploader.upload(req.file.path);

      const newSkill = new Skill({
        icon: result.secure_url,
        title,
        learntDate: parsedLearntDate,
        proficiency,
        shortDescription,
        relatedLibraries,
        color,
      });

      await newSkill.save();
      res.status(201).json({ message: "Created skill successfully", newSkill });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  async getAllSkills(req: Request, res: Response): Promise<void> {
    try {
      const skills: SkillProps[] = await Skill.find();
      res.status(200).json(skills);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  async updateSkillById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const learnt = new Date(req.body.learntDate);

      const validation = skillSchema.safeParse({
        ...req.body,
        learntDate: learnt,
      });
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.errors,
        });
        return;
      }

      const {
        icon,
        title,
        learntDate,
        proficiency,
        shortDescription,
        relatedLibraries,
        color,
      } = req.body;

      const parsedLearntDate = new Date(learntDate);

      const updatedSkill: SkillProps | null = await Skill.findByIdAndUpdate(
        id,
        {
          icon,
          title,
          learntDate: parsedLearntDate,
          proficiency,
          shortDescription,
          relatedLibraries,
          color,
        },
        { new: true }
      );

      if (!updatedSkill) {
        res.status(404).json({ message: "Skill not found" });
        return;
      }
      res.status(200).json(updatedSkill);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }

  async deleteSkillById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedSkill: SkillProps | null = await Skill.findByIdAndDelete(id);
      if (!deletedSkill) {
        res.status(404).json({ message: "Skill not found" });
        return;
      }
      res.status(200).json({ message: "Skill deleted successfully" });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Unknown error occurred" });
      }
    }
  }
}

export default new SkillController();
