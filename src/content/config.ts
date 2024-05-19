import { defineCollection, z } from "astro:content";

const commonSchema = z.object({
  categories: z
    .array(z.string().transform((str) => str.toLowerCase()))
    .default(["uncategorized"]),
  date: z.coerce.date().default(() => new Date(0)),
  title: z.string().default("Untitled"),
});

const blogCollection = defineCollection({
  type: "content",
  schema: commonSchema.extend({
    subheading: z.string().optional(),
    readDuration: z.number().positive().optional(),
  }),
});

const portfolioCollection = defineCollection({
  type: "content",
  schema: commonSchema.extend({
    subheading: z.string().optional(),
    description: z.string(),
    metadata: z.record(z.string()).optional(),
  }),
});

const researchCollection = defineCollection({
  type: "content",
  schema: commonSchema,
});

export const collections = {
  blog: blogCollection,
  portfolio: portfolioCollection,
  research: researchCollection,
};
