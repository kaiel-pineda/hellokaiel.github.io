<script lang="ts">
	import { onMount } from "svelte";
	import SiteNavigationContext from "./site-navigation/SiteNavigationContext.svelte";
	import { getBottomNavigationBackLink, type BottomNavigationContext } from "./site-navigation/bottom-navigation";
	import { isBottomDockVisible } from "./site-navigation/navigation-chrome";
	import { resolveIntersectingNavigationTheme } from "./site-navigation/navigation-theme";

	export let pathname: string;
	export let bottomNavigationContext: BottomNavigationContext | null = null;

	$: backLink = getBottomNavigationBackLink(pathname);
	$: dockVisible = $isBottomDockVisible;
	let navigationElement: HTMLElement | null = null;

	function syncNavigationTheme(): void {
		if (!navigationElement) {
			return;
		}

		const navigationTheme = resolveIntersectingNavigationTheme(navigationElement);

		if (navigationTheme) {
			navigationElement.setAttribute("data-theme", navigationTheme);
			return;
		}

		navigationElement.removeAttribute("data-theme");
	}

	function scrollToTop(): void {
		window.scrollTo({ top: 0, behavior: "smooth" });
	}

	onMount(() => {
		syncNavigationTheme();
		window.addEventListener("scroll", syncNavigationTheme, { passive: true });
		window.addEventListener("resize", syncNavigationTheme);

		return () => {
			window.removeEventListener("scroll", syncNavigationTheme);
			window.removeEventListener("resize", syncNavigationTheme);
		};
	});
</script>

<nav class="site-navigation-dock fixed inset-x-0 z-50" bind:this={navigationElement}>
	<div class={`px-4 transition-[opacity,transform] duration-300 ease-out ${dockVisible ? "pointer-events-none translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
		<div class="mx-auto flex max-w-4xl items-center gap-4">
			<div class="shrink-0">
				<a class="floating-action pointer-events-auto" href={backLink.href} aria-label={backLink.label}>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
						<path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 1 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8" />
					</svg>
				</a>
			</div>
			<div class="bottom-navigation-bar pointer-events-auto min-w-0 flex-1 px-4">
				<SiteNavigationContext context={bottomNavigationContext} />
			</div>
			<div class="shrink-0">
				<button
					class="floating-action pointer-events-auto"
					type="button"
					on:click={scrollToTop}
					aria-label="Scroll to top"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
						<path fill-rule="evenodd" d="M8 12a.5.5 0 0 1-.5-.5V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5A.5.5 0 0 1 8 12" />
					</svg>
				</button>
			</div>
		</div>
	</div>
</nav>
