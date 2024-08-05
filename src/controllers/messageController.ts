import { Request, Response } from "express";
import Messages, { IMessage } from "../models/contact";

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

class messageController {
  //Sending a new message
  async sendMessage(req: Request, res: Response): Promise<void> {
    try {
      const sName = req.body.sName;
      const sEmail = req.body.sEmail;
      const sLocation = req.body.sLocation;
      const message = req.body.message;

      let checkEmail = isValidEmail(sEmail);
      if (!checkEmail) {
        res.status(400).json({ error: "Enter a valid email" });
        return;
      }

      const messageData: Partial<IMessage> = {
        sName,
        sEmail,
        message,
      };

      if (sLocation) {
        messageData.sLocation = sLocation;
      }

      const newMessage = new Messages(messageData);
      await newMessage.save();

      res
        .status(201)
        .json({ message: "Message sent successfully", data: newMessage });
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Getting all messages
  async getAllMessages(req: Request, res: Response): Promise<void> {
    try {
      const blogs: IMessage[] = await Messages.find();
      res.status(200).json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }

  //Delete a message
  async deleteMessage(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const deletedMessage: IMessage | null = await Messages.findByIdAndDelete(
        id
      );

      if (!deletedMessage) {
        res.status(404).json({ message: "Message not found" });
        return;
      }
      res.status(200).json({ message: "Message deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new messageController();
