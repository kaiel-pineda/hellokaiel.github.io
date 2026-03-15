import { getCollection, type CollectionEntry } from "astro:content";
import { getOptionalCollection } from "./content";

export type FeedCollection = "blog" | "portfolio" | "research";

export type FeedEntry = {
	categories: string[];
	collection: FeedCollection;
	date: Date;
	description?: string;
	href: string;
	id: string;
	subheading?: string;
	tags: string[];
	title: string;
};

type ContentEntry = CollectionEntry<FeedCollection>;

function toFeedEntry(entry: ContentEntry): FeedEntry {
	return {
		categories: entry.data.categories,
		collection: entry.collection,
		date: new Date(entry.data.date),
		description: entry.data.description,
		href: `/${entry.collection}/${entry.id}/`,
		id: entry.id,
		subheading: "subheading" in entry.data ? entry.data.subheading : undefined,
		tags: entry.data.tags,
		title: entry.data.title,
	};
}

export function getFeedEntrySummary(entry: FeedEntry): string | undefined {
	return entry.description ?? entry.subheading;
}

export async function getUnifiedFeedEntries(): Promise<FeedEntry[]> {
	const blogEntries = await getCollection("blog");
	const portfolioEntries = await getCollection("portfolio");
	const researchEntries = await getOptionalCollection("research", "./src/content/research");

	return [...blogEntries, ...portfolioEntries, ...researchEntries]
		.map(toFeedEntry)
		.sort((a, b) => b.date.valueOf() - a.date.valueOf());
}

export function groupFeedEntriesByYear(entries: FeedEntry[]): Array<[string, FeedEntry[]]> {
	const groupedEntries = entries.reduce<Record<number, FeedEntry[]>>((acc, entry) => {
		const year = entry.date.getFullYear();
		acc[year] = acc[year] || [];
		acc[year].push(entry);
		return acc;
	}, {});

	return Object.entries(groupedEntries)
		.sort(([a], [b]) => Number(b) - Number(a))
		.map(([year, entriesFromYear]) => [
			year,
			entriesFromYear.sort((a, b) => b.date.valueOf() - a.date.valueOf()),
		]);
}
