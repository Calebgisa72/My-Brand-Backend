import mongoose, { Schema, Document } from 'mongoose';

export interface IProj extends Document{
    pImage: string;
    pTitle: string;
    pTechnologies: [string];
    pShortDesc: string;
    pLongDesc: string;
    pDate: Date;
}

const projectSchema: Schema =new Schema ({
    pImage: { type: String, required: true },
    pTitle: { type: String, required: true },
    pTechnologies:[{type: Object, required: true}],
    pShortDesc: { type: String, required: true },
    pLongDesc: { type: String, required: true },
    pDate: { type: Date, default: Date.now },
});

export default mongoose.model<IProj>('Project', projectSchema);