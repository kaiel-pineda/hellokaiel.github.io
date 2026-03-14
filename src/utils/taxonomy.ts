export type TaxonomySummary<TEntry> = {
	count: number;
	entries: TEntry[];
	label: string;
	slug: string;
	value: string;
};

type DatedEntry = {
	data: {
		date: Date;
	};
};

const fallbackTaxonomyValue = "item";

export function formatTaxonomyLabel(value: string): string {
	return normalizeTaxonomyValue(value)
		.split(" ")
		.map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
		.join(" ");
}

export function normalizeTaxonomyValue(value: string, fallback = fallbackTaxonomyValue): string {
	const normalized = value.trim().replace(/\s+/g, " ").toLowerCase();
	return normalized || fallback;
}

export function normalizeTaxonomyValues(values: string[], options?: { fallback?: string[] }): string[] {
	const normalizedValues = Array.from(new Set(values.map((value) => normalizeTaxonomyValue(value)).filter(Boolean)));

	if (normalizedValues.length > 0) {
		return normalizedValues;
	}

	if (!options?.fallback) {
		return [];
	}

	return Array.from(new Set(options.fallback.map((value) => normalizeTaxonomyValue(value)).filter(Boolean)));
}

export function slugifyTaxonomyValue(value: string, fallback = fallbackTaxonomyValue): string {
	const slug = normalizeTaxonomyValue(value, fallback)
		.replace(/&/g, " and ")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");

	return slug || fallback;
}

export function buildTaxonomyIndex<TEntry extends DatedEntry>(
	entries: TEntry[],
	selectValues: (entry: TEntry) => string[],
): TaxonomySummary<TEntry>[] {
	const taxonomyIndex = new Map<string, TaxonomySummary<TEntry>>();

	for (const entry of entries) {
		const uniqueValues = Array.from(new Set(selectValues(entry).map((value) => normalizeTaxonomyValue(value))));

		for (const value of uniqueValues) {
			const slug = slugifyTaxonomyValue(value);
			const existingValue = taxonomyIndex.get(slug);

			if (existingValue) {
				existingValue.entries.push(entry);
				existingValue.count += 1;
				continue;
			}

			taxonomyIndex.set(slug, {
				count: 1,
				entries: [entry],
				label: formatTaxonomyLabel(value),
				slug,
				value,
			});
		}
	}

	return Array.from(taxonomyIndex.values())
		.map((taxonomy) => ({
			...taxonomy,
			entries: taxonomy.entries.sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()),
		}))
		.sort((a, b) => b.count - a.count || a.label.localeCompare(b.label));
}

export function getTaxonomyBySlug<TEntry extends DatedEntry>(
	entries: TEntry[],
	selectValues: (entry: TEntry) => string[],
	slug: string,
): TaxonomySummary<TEntry> | undefined {
	return buildTaxonomyIndex(entries, selectValues).find((taxonomy) => taxonomy.slug === slug);
}
