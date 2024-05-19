/** @type {import("prettier").Config} */
export default {
	plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss", "@trivago/prettier-plugin-sort-imports"],
	useTabs: true,
	bracketSameLine: true,
	printWidth: 250,
	overrides: [
		{
			files: "*.astro",
			options: {
				parser: "astro",
			},
		},
	],
};
