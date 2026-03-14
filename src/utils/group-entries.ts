type DatedEntry = {
	data: {
		date: Date;
	};
};

export function groupEntriesByYear<TEntry extends DatedEntry>(entries: TEntry[]): Array<[string, TEntry[]]> {
	const groupedEntries = entries.reduce<Record<number, TEntry[]>>((acc, entry) => {
		const year = new Date(entry.data.date).getFullYear();
		acc[year] = acc[year] || [];
		acc[year].push(entry);
		return acc;
	}, {});

	return Object.entries(groupedEntries)
		.sort(([a], [b]) => Number(b) - Number(a))
		.map(([year, entriesFromYear]) => [
			year,
			entriesFromYear.sort((a, b) => new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()),
		]);
}
