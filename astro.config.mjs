import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://hellokaiel.us",
	redirects: {
		"/": "/blog",
	},
	integrations: [
		svelte(),
		tailwind({
			nesting: true,
		}),
		mdx(),
	],
});
