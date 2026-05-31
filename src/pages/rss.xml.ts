import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getUnifiedFeedEntries } from "../utils/feed-entries";
import { siteDescription, siteName } from "../utils/site";

export async function GET(context: APIContext) {
	const entries = await getUnifiedFeedEntries();
	return rss({
		title: siteName,
		description: siteDescription,
		site: context.site!,
		items: entries.map((entry) => ({
			title: entry.title,
			pubDate: entry.date,
			description: entry.description ?? entry.subheading,
			link: entry.href,
		})),
		customData: "<language>en-us</language>",
	});
}
