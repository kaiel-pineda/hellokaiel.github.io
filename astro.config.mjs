import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://hellokaiel.us",
	redirects: {
		"/": "/blog",
	},
	integrations: [
		svelte(),
		mdx(),
	],
});
