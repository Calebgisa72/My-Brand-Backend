import mongoose, { Schema, Document } from "mongoose";

export enum Proficiency {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
  Expert = "Expert",
}

export interface SkillProps extends Document {
  title: string;
  icon: string;
  learntDate: Date;
  proficiency: Proficiency;
  shortDescription: string;
  relatedLibraries: string;
  color: string;
}

const skillSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    icon: { type: String, required: true },
    learntDate: { type: Date, required: true },
    proficiency: {
      type: String,
      enum: Object.values(Proficiency),
      required: true,
    },
    shortDescription: { type: String, required: true },
    relatedLibraries: { type: String },
    color: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<SkillProps>("Skill", skillSchema);
