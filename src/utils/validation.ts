import { z } from "zod";
import { Proficiency } from "../models/skills";

const requiredString = z.string().trim().min(1, "Required");
const finishingDateSchema = z.union([z.date(), z.literal("present")]);

export const projectSchema = z.object({
  pImage: requiredString,
  pTitle: requiredString,
  pTechnologies: z.array(z.string()),
  pShortDesc: requiredString,
  pLongDesc: requiredString,
  pStartDate: z.date(),
  pEndDate: finishingDateSchema,
  pLink: z.string().url().optional(),
});

export const skillSchema = z.object({
  title: z.string().nonempty("Title is required"),
  icon: z.string().nonempty("Icon URL is required").optional(),
  learntDate: z.date(),
  proficiency: z.nativeEnum(Proficiency, {
    errorMap: (issue, _ctx) => {
      if (issue.code === "invalid_enum_value") {
        return {
          message: `Invalid proficiency level. Valid levels are: ${Object.values(
            Proficiency
          ).join(", ")}`,
        };
      }
      return { message: "Invalid value" };
    },
  }),
  shortDescription: z.string().nonempty("Short description is required"),
  relatedLibraries: z.string().optional(),
  color: requiredString,
});

export const profileSchema = z.object({
  welcomeText: requiredString,
  name: requiredString,
  frontDescription: requiredString,
  aboutTitle: requiredString,
  aboutDescription: requiredString,
});
