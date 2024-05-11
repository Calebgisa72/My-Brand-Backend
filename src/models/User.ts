import mongoose, { Document, Schema } from 'mongoose';

export interface UserDocument extends Document {
    username: string;
    password: string;
    cv: string;
    profile: string;
}

const userSchema = new Schema<UserDocument>({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cv: { type: String },
    profile: { type: String }
});

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;