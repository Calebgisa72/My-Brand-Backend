import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");
const finishingDateSchema = z.union([z.date(), z.literal("present")]);

export const projectSchema = z.object({
  pImage: requiredString.optional(),
  pTitle: requiredString,
  pTechnologies: z.array(z.string()),
  pShortDesc: requiredString,
  pLongDesc: requiredString,
  pStartDate: z.date(),
  pEndDate: finishingDateSchema,
  pLink: z.string().url().optional(),
});
