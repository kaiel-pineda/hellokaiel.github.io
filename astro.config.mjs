import mdx from "@astrojs/mdx";
import svelte from "@astrojs/svelte";
import { defineConfig } from "astro/config";
import { EventEmitter } from "node:events";

// Workaround for https://github.com/withastro/astro/issues/15883 (fixed in PR #15884, not yet released as of v6.0.4)
EventEmitter.defaultMaxListeners = 20;

export default defineConfig({
	site: "https://hellokaiel.us",
	integrations: [svelte(), mdx()],
});
