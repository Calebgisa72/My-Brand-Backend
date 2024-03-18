import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
    sender: string;
    comment: string;
}

const CommentSchema: Schema = new Schema({
    sender: { type: String, required: true },
    comment: { type: String, required: true }
});

export default mongoose.model<IComment>('Comment', CommentSchema);
