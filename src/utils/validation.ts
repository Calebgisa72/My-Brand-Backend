import { z } from "zod";
import { Proficiency } from "../models/skills";

const requiredString = z.string().trim().min(1, "Required");
const atLeastThreeSkills = z.string().refine(
  (val) => {
    const commaCount = (val.match(/,/g) || []).length;
    return commaCount >= 3;
  },
  {
    message: "Minimum of 3 tech (comma-separated) are required",
  }
);

export const projectSchema = z.object({
  pTitle: requiredString,
  pTechnologies: atLeastThreeSkills,
  pShortDesc: requiredString,
  pLongDesc: requiredString,
  pStartDate: z.date(),
  pEndDate: z.union([
    z
      .string()
      .nonempty("End date is required")
      .transform((str) => {
        if (str === "present") return str;
        const date = new Date(str);
        if (isNaN(date.getTime())) {
          throw new Error("Invalid end date.");
        }
        return date;
      }),
    z.date(),
    z.literal("present"),
  ]),
  pLink: z.string().url().optional(),
});

export const skillSchema = z.object({
  title: z.string().nonempty("Title is required"),
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
  school: requiredString,
  currentCourse: requiredString,
  experience: requiredString,
});
