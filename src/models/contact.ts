import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
    sName: string;
    sEmail: string;
    sLocation: string;
    message: string;
    dateSent: Date;
}

const messageSchema: Schema = new Schema ({
    sName: {type: String, required:true},
    sEmail: {type: String, required: true},
    sLocation: {type: String},
    message: {type: String, required: true},
    dateSent: {type: Date, default: Date.now}
})

export default mongoose.model<IMessage>("Messages",messageSchema);