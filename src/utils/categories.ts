import type { ContentEntry } from "./content-entries";
import { buildTaxonomyIndex, getTaxonomyBySlug, slugifyTaxonomyValue, type TaxonomySummary } from "./taxonomy";

export type CategorySummary = TaxonomySummary<ContentEntry>;

export function getCategoryHref(value: string): string {
	return `/categories/${slugifyTaxonomyValue(value, "uncategorized")}/`;
}

export function buildCategoryIndex(entries: ContentEntry[]): CategorySummary[] {
	return buildTaxonomyIndex(entries, (entry) => entry.data.categories);
}

export function getCategoryBySlug(entries: ContentEntry[], slug: string): CategorySummary | undefined {
	return getTaxonomyBySlug(entries, (entry) => entry.data.categories, slug);
}
