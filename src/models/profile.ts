import mongoose, { Document, Schema } from "mongoose";

export interface ProfileDocument extends Document {
  profileImage: string;
  welcomeText: string;
  name: string;
  frontDescription: string;
  aboutTitle: string;
  aboutDescription: string;
}

const profileSchema = new Schema<ProfileDocument>({
  profileImage: { type: String, required: true },
  welcomeText: { type: String, required: true },
  name: { type: String, required: true },
  frontDescription: { type: String, required: true },
  aboutTitle: { type: String, required: true },
  aboutDescription: { type: String, required: true },
});

const Profile = mongoose.model<ProfileDocument>("Profile", profileSchema);

export default Profile;
