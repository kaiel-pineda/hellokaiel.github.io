import { getCollection, type CollectionEntry } from "astro:content";
import { getOptionalCollection } from "./content";

export type ContentEntry = CollectionEntry<"blog"> | CollectionEntry<"portfolio"> | CollectionEntry<"research">;

export async function getAllContentEntries(): Promise<ContentEntry[]> {
	const blogEntries = await getCollection("blog");
	const portfolioEntries = await getCollection("portfolio");
	const researchEntries = await getOptionalCollection("research", "./src/content/research");

	return [...blogEntries, ...portfolioEntries, ...researchEntries];
}
