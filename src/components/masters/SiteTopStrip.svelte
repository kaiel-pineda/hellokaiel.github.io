<script lang="ts">
	import { onMount } from "svelte";
	import { resetSiteTopStripState, siteTopStripState } from "./site-navigation/navigation-chrome";
	import { resolveIntersectingNavigationTheme } from "./site-navigation/navigation-theme";
	import SiteNavigationLogo from "./site-navigation/SiteNavigationLogo.svelte";
	import SiteNavigationThemePickerToggle from "./site-navigation/SiteNavigationThemePickerToggle.svelte";

	export let pathname: string;

	const TOP_STRIP_HEIGHT = 72;

	let stripShellElement: HTMLElement | null = null;
	let stripElement: HTMLElement | null = null;
	let isPinned = false;
	let isVisible = true;
	let lastScrollY = 0;

	function syncChromeState(): void {
		siteTopStripState.set({
			height: TOP_STRIP_HEIGHT,
			isPinned,
			isVisible,
		});
	}

	function syncTopStripState(): void {
		const currentScrollY = window.scrollY;
		const scrollingUp = currentScrollY < lastScrollY;
		const pinned = (stripShellElement?.getBoundingClientRect().top ?? 0) < 0;

		isPinned = pinned;

		if (!pinned) {
			isVisible = true;
			syncChromeState();
			lastScrollY = currentScrollY;
			return;
		}

		isVisible = scrollingUp;
		syncChromeState();
		lastScrollY = currentScrollY;
	}

	function syncNavigationTheme(): void {
		if (!stripElement) {
			return;
		}

		const navigationTheme = resolveIntersectingNavigationTheme(stripElement);

		if (navigationTheme) {
			stripElement.setAttribute("data-theme", navigationTheme);
			return;
		}

		stripElement.removeAttribute("data-theme");
	}

	onMount(() => {
		lastScrollY = window.scrollY;
		syncTopStripState();
		syncNavigationTheme();
		window.addEventListener("scroll", syncTopStripState, { passive: true });
		window.addEventListener("scroll", syncNavigationTheme, { passive: true });
		window.addEventListener("resize", syncTopStripState);
		window.addEventListener("resize", syncNavigationTheme);

		return () => {
			window.removeEventListener("scroll", syncTopStripState);
			window.removeEventListener("scroll", syncNavigationTheme);
			window.removeEventListener("resize", syncTopStripState);
			window.removeEventListener("resize", syncNavigationTheme);
			resetSiteTopStripState();
		};
	});
</script>

<div class="site-top-strip-shell" bind:this={stripShellElement}>
	<div
		class={`top-strip ${isPinned ? "top-strip-fixed" : ""} ${isPinned && !isVisible ? "top-strip-is-hidden" : ""}`}
		bind:this={stripElement}
	>
		<div class="page-container">
			<div class="top-strip-inner">
				<div class="top-strip-left">
					<SiteNavigationLogo class="top-strip-logo" />
				</div>

				<div class="top-strip-right">
					<SiteNavigationThemePickerToggle />
				</div>
			</div>
		</div>
	</div>
</div>
