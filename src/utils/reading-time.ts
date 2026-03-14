import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import type { ContentEntry } from "./content-entries";

export type ReadingTime = {
	label: string;
	minutes: number;
	words: number;
};

const WORDS_PER_MINUTE = 225;

const stripFrontmatter = (source: string) => source.replace(/^\s*---[\s\S]*?---\s*/, "");

const stripNonReadableContent = (source: string) =>
	source
		.replace(/<script[\s\S]*?<\/script>/gi, " ")
		.replace(/<style[\s\S]*?<\/style>/gi, " ")
		.replace(/```[\s\S]*?```/g, " ")
		.replace(/`[^`\n]+`/g, " ")
		.replace(/{\/\*[\s\S]*?\*\/}/g, " ")
		.replace(/<!--[\s\S]*?-->/g, " ")
		.replace(/^\s*import\s.+$/gm, " ")
		.replace(/^\s*export\s.+$/gm, " ");

const stripMarkup = (source: string) =>
	source
		.replace(/<[^>]+>/g, " ")
		.replace(/{[^}]*}/g, " ")
		.replace(/[#>*_\-[\]!()[\]`]/g, " ")
		.replace(/&[a-zA-Z0-9#]+;/g, " ");

const countWords = (source: string) => {
	const words = stripMarkup(stripNonReadableContent(stripFrontmatter(source)))
		.split(/\s+/)
		.map((word) => word.trim())
		.filter(Boolean);

	return words.length;
};

const getEntrySourceCandidates = (entry: ContentEntry) => [
	resolve(process.cwd(), "src", "content", entry.collection, entry.id, "entry.astro"),
	resolve(process.cwd(), "src", "content", entry.collection, entry.id, "index.mdx"),
	resolve(process.cwd(), "src", "content", entry.collection, entry.id, "index.md"),
];

export async function getEntryReadingTime(entry: ContentEntry): Promise<ReadingTime | null> {
	for (const sourcePath of getEntrySourceCandidates(entry)) {
		if (!existsSync(sourcePath)) {
			continue;
		}

		const source = await readFile(sourcePath, "utf8");
		const words = countWords(source);

		if (words === 0) {
			continue;
		}

		const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));

		return {
			label: minutes === 1 ? "1 minute read" : `${minutes} minutes read`,
			minutes,
			words,
		};
	}

	return null;
}
