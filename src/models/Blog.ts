import mongoose, { Schema, Document } from 'mongoose';
import { IComment } from './comment';

export interface IBlog extends Document {
    bImage: string;
    bTitle: string;
    bShortDesc: string;
    bLongDesc: string;
    bDate: Date;
    bNumOfLike: number;
    bComments: IComment[];
}

const blogSchema: Schema = new Schema({
    bImage: { type: String, required: true },
    bTitle: { type: String, required: true },
    bShortDesc: { type: String, required: true },
    bLongDesc: { type: String, required: true },
    bDate: { type: Date, default: Date.now },
    bNumOfLike: { type: Number, default: 0 },
    bComments: [{ type: Object, ref: 'Comment' }]
});

export default mongoose.model<IBlog>('Blog', blogSchema);
