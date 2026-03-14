<script lang="ts">
	import { onMount } from "svelte";
	import { getPrimaryNavigationLinks } from "./site-navigation/primary-navigation";
	import { resetSiteTopStripState, siteTopStripState } from "./site-navigation/navigation-chrome";
	import { resolveIntersectingNavigationTheme } from "./site-navigation/navigation-theme";
	import SiteNavigationLogo from "./site-navigation/SiteNavigationLogo.svelte";
	import SiteTopStripMenu from "./site-navigation/SiteTopStripMenu.svelte";
	import SiteNavigationThemePickerToggle from "./site-navigation/SiteNavigationThemePickerToggle.svelte";

	export let pathname: string;

	$: links = getPrimaryNavigationLinks(pathname);

	let stripShellElement: HTMLElement | null = null;
	let stripElement: HTMLElement | null = null;
	let stripHeight = 0;
	let isPinned = false;
	let isVisible = true;
	let lastScrollY = 0;

	function syncChromeState(): void {
		siteTopStripState.set({
			height: stripHeight,
			isPinned,
			isVisible,
		});
	}

	function syncStripHeight(): void {
		stripHeight = stripElement?.offsetHeight ?? 0;
		syncChromeState();
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
		syncStripHeight();
		lastScrollY = window.scrollY;
		syncTopStripState();
		syncNavigationTheme();

		const resizeObserver =
			typeof ResizeObserver !== "undefined" && stripElement
				? new ResizeObserver(() => {
						syncStripHeight();
						syncTopStripState();
						syncNavigationTheme();
					})
				: null;

		resizeObserver?.observe(stripElement);
		window.addEventListener("scroll", syncTopStripState, { passive: true });
		window.addEventListener("scroll", syncNavigationTheme, { passive: true });
		window.addEventListener("resize", syncStripHeight);
		window.addEventListener("resize", syncTopStripState);
		window.addEventListener("resize", syncNavigationTheme);

		return () => {
			resizeObserver?.disconnect();
			window.removeEventListener("scroll", syncTopStripState);
			window.removeEventListener("scroll", syncNavigationTheme);
			window.removeEventListener("resize", syncStripHeight);
			window.removeEventListener("resize", syncTopStripState);
			window.removeEventListener("resize", syncNavigationTheme);
			resetSiteTopStripState();
		};
	});
</script>

<div class="site-top-strip-shell" bind:this={stripShellElement} style:height={stripHeight ? `${stripHeight}px` : undefined}>
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
					<nav class="top-strip-nav hidden md:flex" aria-label="Primary">
						{#each links as link}
							<a class:is-active={link.isActive} class="top-strip-link" href={link.href} aria-current={link.isActive ? "page" : undefined}>
								{link.label}
							</a>
						{/each}
					</nav>

					<SiteNavigationThemePickerToggle />

					<SiteTopStripMenu {links} />
				</div>
			</div>
		</div>
	</div>
</div>
