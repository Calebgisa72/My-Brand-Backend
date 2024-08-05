import mongoose, { Schema, Document } from "mongoose";

export interface IProj extends Document {
  pImage: string;
  pTitle: string;
  pTechnologies: [string];
  pShortDesc: string;
  pLongDesc: string;
  pStartDate: Date;
  pEndDate: Date | string;
  pLink?: string;
}

const projectSchema: Schema = new Schema(
  {
    pImage: { type: String, required: true },
    pTitle: { type: String, required: true },
    pTechnologies: [{ type: String, required: true, default: [] }],
    pShortDesc: { type: String, required: true },
    pLongDesc: { type: String, required: true },
    pStartDate: { type: Date, required: true },
    pEndDate: { type: Schema.Types.Mixed },
    pLink: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProj>("Project", projectSchema);
