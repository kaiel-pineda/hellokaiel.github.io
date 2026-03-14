<script lang="ts">
	import { isSiteNavigationDropdownDropped } from "../../global-stores";
	import { clickOutside } from "../../actions/clickOutside";
	import type { PrimaryNavigationLink } from "./primary-navigation";

	export let links: PrimaryNavigationLink[] = [];

	function closeMenu(): void {
		isSiteNavigationDropdownDropped.set(false);
	}

	function toggleMenu(): void {
		isSiteNavigationDropdownDropped.update((value) => !value);
	}
</script>

<div class="top-strip-menu md:hidden" use:clickOutside={{ enabled: $isSiteNavigationDropdownDropped, onOutside: closeMenu }}>
	<button class="floating-action-sm top-strip-menu-toggle" type="button" aria-label="Open navigation" aria-expanded={$isSiteNavigationDropdownDropped} on:click={toggleMenu}>
		<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
			<path
				fill-rule="evenodd"
				d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 2.5 4h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5"
			></path>
		</svg>
	</button>

	{#if $isSiteNavigationDropdownDropped}
		<nav class="top-strip-menu-panel" aria-label="Mobile primary">
			{#each links as link}
				<a class:is-active={link.isActive} class="top-strip-menu-link" href={link.href} aria-current={link.isActive ? "page" : undefined} on:click={closeMenu}>
					{link.label}
				</a>
			{/each}
		</nav>
	{/if}
</div>
