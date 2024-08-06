import { Request, Response } from "express";
import cloudinary from "../services/cloudinary";
import Profile from "../models/profile";

export const updateCv = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      res.status(400).json({ message: "Cv file is required" });
      return;
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const id = req.params.id;
    const user = await Profile.findById(id);

    if (!user) {
      res.status(404).json({ messsage: "User not found" });
      return;
    }

    user.cv = result.secure_url;
    await user.save();
    res.status(200).json({ message: "Added CV successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};
