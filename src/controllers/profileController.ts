import { Request, Response } from "express";
import cloudinary from "../services/cloudinary";
import Profile from "../models/profile";
import { profileSchema } from "../utils/validation";

class ProfileController {
  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const validation = profileSchema.safeParse(req.body);
      if (!validation.success) {
        res.status(400).json({
          message: "Validation error",
          errors: validation.error.errors,
        });
        return;
      }

      const existingProfile = await Profile.findOne();

      const {
        profileImage,
        welcomeText,
        name,
        frontDescription,
        aboutTitle,
        aboutDescription,
      } = req.body;

      let response;

      if (existingProfile) {
        response = await Profile.findOneAndUpdate(
          { _id: existingProfile._id },
          {
            profileImage,
            welcomeText,
            name,
            frontDescription,
            aboutTitle,
            aboutDescription,
          },
          { new: true }
        );
      } else {
        if (!req.file) {
          res.status(400).json({ message: "Project Image file is required" });
          return;
        }
        const result = await cloudinary.uploader.upload(req.file.path);
        response = await Profile.create({
          profileImage: result.secure_url,
          welcomeText,
          name,
          frontDescription,
          aboutTitle,
          aboutDescription,
        });
      }

      res
        .status(200)
        .json({ message: "Profile updated successfully", response });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  getProfile = async (req: Request, res: Response) => {
    try {
      const profile = (await Profile.findOne()) || {};
      res.status(200).json({ message: "Profile data", profile });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
}

export default new ProfileController();
