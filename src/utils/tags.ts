import type { ContentEntry } from "./content-entries";
import { buildTaxonomyIndex, getTaxonomyBySlug, slugifyTaxonomyValue, type TaxonomySummary } from "./taxonomy";

export type TagSummary = TaxonomySummary<ContentEntry>;

export function getTagHref(value: string): string {
	return `/tags/${slugifyTaxonomyValue(value, "tag")}/`;
}

export function buildTagIndex(entries: ContentEntry[]): TagSummary[] {
	return buildTaxonomyIndex(entries, (entry) => entry.data.tags);
}

export function getTagBySlug(entries: ContentEntry[], slug: string): TagSummary | undefined {
	return getTaxonomyBySlug(entries, (entry) => entry.data.tags, slug);
}
