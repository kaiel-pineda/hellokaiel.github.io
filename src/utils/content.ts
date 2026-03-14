import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { getCollection, type CollectionEntry, type CollectionKey } from "astro:content";

const hasContentEntries = (base: string) => {
	const basePath = resolve(base);
	return existsSync(basePath) && readdirSync(basePath, { recursive: true, withFileTypes: true }).some((entry) => entry.isFile() && /\.(md|mdx)$/.test(entry.name));
};

export const getOptionalCollection = async <C extends CollectionKey>(collection: C, base: string): Promise<CollectionEntry<C>[]> => {
	if (!hasContentEntries(base)) {
		return [];
	}

	return getCollection(collection);
};
