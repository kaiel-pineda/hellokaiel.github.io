import { siteAuthorName, siteDescription, siteLocale, siteName } from "./site";

export type SeoType = "website" | "article";

export type SeoMetadata = {
	description?: string;
	image?: string;
	imageAlt?: string;
	keywords?: string[];
	modifiedTime?: Date | string;
	noindex?: boolean;
	publishedTime?: Date | string;
	section?: string;
	type?: SeoType;
};

type ResolvedSeoMetadata = {
	canonicalUrl: string;
	description: string;
	image?: string;
	imageAlt?: string;
	jsonLd: Record<string, unknown>;
	keywords: string[];
	modifiedTime?: string;
	noindex: boolean;
	publishedTime?: string;
	robots: string;
	title: string;
	type: SeoType;
};

const toAbsoluteUrl = (value: string | undefined, site: URL | undefined): string | undefined => {
	if (!value || !site) {
		return undefined;
	}

	return new URL(value, site).toString();
};

const toIsoString = (value: Date | string | undefined): string | undefined => {
	if (!value) {
		return undefined;
	}

	const normalizedDate = value instanceof Date ? value : new Date(value);
	return Number.isNaN(normalizedDate.valueOf()) ? undefined : normalizedDate.toISOString();
};

const filterEmptyValues = <T extends Record<string, unknown>>(value: T): T => {
	return Object.fromEntries(Object.entries(value).filter(([, entryValue]) => entryValue !== undefined && entryValue !== null && entryValue !== "")) as T;
};

export function resolveSeoMetadata(options: {
	metadata?: SeoMetadata;
	pathname: string;
	site?: URL;
	title?: string;
}): ResolvedSeoMetadata {
	const { metadata = {}, pathname, site, title } = options;
	const resolvedTitle = title ? `${title} | ${siteName}` : siteName;
	const resolvedDescription = metadata.description ?? siteDescription;
	const canonicalUrl = site ? new URL(pathname, site).toString() : pathname;
	const resolvedType = metadata.type ?? "website";
	const resolvedPublishedTime = toIsoString(metadata.publishedTime);
	const resolvedModifiedTime = toIsoString(metadata.modifiedTime);
	const resolvedKeywords = Array.from(new Set((metadata.keywords ?? []).map((keyword) => keyword.trim()).filter(Boolean)));
	const resolvedImage = toAbsoluteUrl(metadata.image, site);
	const resolvedImageAlt = metadata.imageAlt ?? resolvedTitle;
	const noindex = metadata.noindex ?? false;

	const jsonLd =
		resolvedType === "article"
			? filterEmptyValues({
					"@context": "https://schema.org",
					"@type": "Article",
					author: {
						"@type": "Person",
						name: siteAuthorName,
					},
					dateModified: resolvedModifiedTime,
					datePublished: resolvedPublishedTime,
					description: resolvedDescription,
					headline: title ?? siteName,
					image: resolvedImage,
					inLanguage: siteLocale.replace("_", "-"),
					keywords: resolvedKeywords.length > 0 ? resolvedKeywords.join(", ") : undefined,
					mainEntityOfPage: canonicalUrl,
					publisher: {
						"@type": "Person",
						name: siteAuthorName,
					},
					url: canonicalUrl,
			  })
			: filterEmptyValues({
					"@context": "https://schema.org",
					"@type": "WebPage",
					description: resolvedDescription,
					inLanguage: siteLocale.replace("_", "-"),
					isPartOf: site
						? {
								"@type": "WebSite",
								name: siteName,
								url: site.toString(),
						  }
						: undefined,
					name: title ?? siteName,
					url: canonicalUrl,
			  });

	return {
		canonicalUrl,
		description: resolvedDescription,
		image: resolvedImage,
		imageAlt: resolvedImageAlt,
		jsonLd,
		keywords: resolvedKeywords,
		modifiedTime: resolvedModifiedTime,
		noindex,
		publishedTime: resolvedPublishedTime,
		robots: noindex ? "noindex, nofollow" : "index, follow",
		title: resolvedTitle,
		type: resolvedType,
	};
}
