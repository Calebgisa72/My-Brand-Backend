import mongoose, { Document, Schema } from "mongoose";

export interface ProfileDocument extends Document {
  username: string;
  password: string;
  cv: string;
  profile: string;
}

const ProfileSchema = new Schema<ProfileDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cv: { type: String },
  profile: { type: String },
});

const Profile = mongoose.model<ProfileDocument>("Profile", ProfileSchema);

export default Profile;
