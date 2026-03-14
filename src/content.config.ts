import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { glob } from "astro/loaders";
import { defineCollection, z } from "astro:content";
import { normalizeTaxonomyValues } from "./utils/taxonomy";

const contentPattern = "**/*.{md,mdx}";

const createContentLoader = (base: string) => {
	const basePath = resolve(base);
	const hasEntries =
		existsSync(basePath) &&
		readdirSync(basePath, { recursive: true, withFileTypes: true }).some((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name));

	return hasEntries ? glob({ base, pattern: contentPattern }) : () => [];
};

const commonSchema = z.object({
	categories: z.array(z.string()).default(["uncategorized"]).transform((categories) => normalizeTaxonomyValues(categories, { fallback: ["uncategorized"] })),
	date: z.coerce.date().default(() => new Date(0)),
	description: z.string().optional(),
	tags: z.array(z.string()).default([]).transform((tags) => normalizeTaxonomyValues(tags)),
	title: z.string().default("Untitled"),
});

const blogCollection = defineCollection({
	loader: createContentLoader("./src/content/blog"),
	schema: commonSchema.extend({
		subheading: z.string().optional(),
	}),
});

const portfolioCollection = defineCollection({
	loader: createContentLoader("./src/content/portfolio"),
	schema: commonSchema.extend({
		subheading: z.string().optional(),
		description: z.string(),
		metadata: z.record(z.string(), z.string()).optional(),
	}),
});

const researchCollection = defineCollection({
	loader: createContentLoader("./src/content/research"),
	schema: commonSchema,
});

export const collections = {
	blog: blogCollection,
	portfolio: portfolioCollection,
	research: researchCollection,
};
