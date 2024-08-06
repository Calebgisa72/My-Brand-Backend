import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/profile";
import { generateToken } from "../services/authService";

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({});

    const hashedPassword = bcrypt.hashSync(password, 10);

    if (existingUser) {
      await User.findOneAndUpdate({}, { username, password: hashedPassword });
    } else {
      await User.create({ username, password: hashedPassword });
    }

    res.status(200).json({ message: "User credentials updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (user && bcrypt.compareSync(password, user.password)) {
      const token = generateToken({ username: user.username });
      res.status(200).json({ message: "Signed in successfully", token });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
