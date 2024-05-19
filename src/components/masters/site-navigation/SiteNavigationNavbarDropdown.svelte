<script lang="ts">
	import { isSiteNavigationDropdownDropped } from "../../global-stores";
	import { onMount } from "svelte";

	let navigationDropdownElement: HTMLElement | null;

	function handleOutsideClick(event: MouseEvent): void {
		if ($isSiteNavigationDropdownDropped && navigationDropdownElement && !navigationDropdownElement.contains(event.target as Node)) {
			isSiteNavigationDropdownDropped.set(false);
		}
	}

	onMount(() => {
		if (typeof window !== "undefined") {
			document.addEventListener("mousedown", handleOutsideClick);
			return () => {
				document.removeEventListener("mousedown", handleOutsideClick);
			};
		}
	});

	const toggleNavigationDropdown = (): void => {
		isSiteNavigationDropdownDropped.update((value) => !value);
	};
</script>

<div class="relative" bind:this={navigationDropdownElement}>
	<button on:click|preventDefault={toggleNavigationDropdown}>
		<div class="flex items-center gap-x-1">
			<span>Collections</span>
			<svg
				style:transform={$isSiteNavigationDropdownDropped ? "rotate(180deg)" : "rotate(0deg)"}
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
				stroke-linejoin="round">
				<path d="m6 9 6 6 6-6" />
			</svg>
		</div>
	</button>
	{#if $isSiteNavigationDropdownDropped}
		<div class="fixed top-8 mt-8 flex max-h-[calc(100vh_-_1.5rem)] min-w-max flex-col gap-y-6 overflow-y-auto p-1">
			{#each [{ href: "/blog", label: "Blog" }, { href: "/portfolio", label: "Portfolio" }, { href: "/research", label: "Research" }] as item}
				<a class="min-w-40 rounded-lg p-3 font-display text-base font-medium border border-dynamic-neutral-300 bg-dynamic-neutral-50" href={item.href}>{item.label}</a>
			{/each}
		</div>
	{/if}
</div>
