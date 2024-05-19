/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
	theme: {
		extend: {
			animation: {
				"logo-ring": "logo-ring 800ms cubic-bezier(0.4, 0, 0.2, 1) both",
				"logo-inner-grow": "logo-inner-grow 250ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
			},
			fontFamily: {
				display: ['"Inter Variable"', "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
				sans: ['"Roboto Flex Variable"', "Roboto", "Helvetica Neue", "Arial", "sans-serif"],
			},
			keyframes: {
				"logo-inner-grow": {
					"0%": {
						"-webkit-transform": "scale(0)",
						transform: "scale(0)",
						opacity: "0",
					},
					"100%": {
						"-webkit-transform": "scale(1)",
						transform: "scale(1)",
						opacity: "1",
					},
				},
				"logo-ring": {
					"0%": {
						"-webkit-transform": "scale(0.5)",
						transform: "scale(0.5)",
						opacity: "1",
					},
					"100%": {
						"-webkit-transform": "scale(1)",
						transform: "scale(1)",
						opacity: "0",
					},
				},
			},
		},
	},
	plugins: [
		require("@tailwindcss/typography"),
		require("tailwindcss-themer")({
			themes: [
				{
					name: "theme-light",
					selectors: ['[data-theme="light"]'],
					extend: {
						colors: {
							"dynamic-neutral": {
								0: "#ffffff",
								50: "#f9f9f9",
								100: "#f4f4f4",
								200: "#ededed",
								300: "#e0e0e0",
								400: "#bcbcbc",
								500: "#9e9e9e",
								600: "#727272",
								700: "#606060",
								800: "#424242",
								900: "#212121",
								950: "#1c1c1c",
							},
							"dynamic-primary": "#0a2153",
							"dynamic-article": "#f97316",
							"dynamic-project": "#3b82f6",
							"dynamic-study": "#22c55e",
						},
					},
				},
				{
					name: "theme-dark",
					selectors: ['[data-theme="dark"]'],
					extend: {
						colors: {
							"dynamic-neutral": {
								0: "#0b0b0b",
								50: "#111111",
								100: "#161616",
								200: "#1d1d1d",
								300: "#2a2a2a",
								400: "#4e4e4e",
								500: "#6c6c6c",
								600: "#989898",
								700: "#aaaaaa",
								800: "#c8c8c8",
								900: "#e9e9e9",
								950: "#eeeeee",
							},
							"dynamic-primary": "#0a2153",
							"dynamic-article": "#ea580c",
							"dynamic-project": "#2563eb",
							"dynamic-study": "#16a34a",
						},
					},
				},
				{
					name: "theme-black",
					selectors: ['[data-theme="black"]'],
					extend: {
						colors: {
							"dynamic-neutral": {
								0: "#000000",
								50: "#060606",
								100: "#0b0b0b",
								200: "#121212",
								300: "#1f1f1f",
								400: "#434343",
								500: "#616161",
								600: "#8d8d8d",
								700: "#9f9f9f",
								800: "#bdbdbd",
								900: "#dedede",
								950: "#e3e3e3",
							},
							"dynamic-primary": "#0a2153",
							"dynamic-article": "#ea580c",
							"dynamic-project": "#2563eb",
							"dynamic-study": "#16a34a",
						},
					},
				},
			],
		}),
	],
};
