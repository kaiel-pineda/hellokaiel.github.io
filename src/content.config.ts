import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { normalizeTaxonomyValues } from "./utils/taxonomy";

const commonSchema = z.object({
	categories: z.array(z.string()).default(["uncategorized"]).transform((categories) => normalizeTaxonomyValues(categories, { fallback: ["uncategorized"] })),
	date: z.coerce.date().default(() => new Date(0)),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]).transform((tags) => normalizeTaxonomyValues(tags)),
	title: z.string().default("Untitled"),
});

const blogCollection = defineCollection({
	loader: glob({ base: "./src/content/blog", pattern: "**/*.{md,mdx}" }),
	schema: commonSchema.extend({
		subheading: z.string().optional(),
	}),
});

const portfolioCollection = defineCollection({
	loader: glob({ base: "./src/content/portfolio", pattern: "**/*.{md,mdx}" }),
	schema: commonSchema.extend({
		subheading: z.string().optional(),
		description: z.string(),
		metadata: z.record(z.string(), z.string()).optional(),
	}),
});

const researchCollection = defineCollection({
	loader: glob({ base: "./src/content/research", pattern: "**/*.{md,mdx}" }),
	schema: commonSchema,
});

export const collections = {
	blog: blogCollection,
	portfolio: portfolioCollection,
	research: researchCollection,
};
