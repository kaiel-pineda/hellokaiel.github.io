<script lang="ts">
	import { isSiteNavigationThemePickerOpen, selectedTheme } from "../../global-stores";
	import { onMount, afterUpdate } from "svelte";
	import { writable } from "svelte/store";
	import { slide } from "svelte/transition";

	let navigationThemePickerElement: HTMLElement;
	let firstButton: HTMLElement | null = null;
	let currentTheme = writable("light");

	function handleOutsideClick(event: MouseEvent): void {
		if ($isSiteNavigationThemePickerOpen && navigationThemePickerElement && !navigationThemePickerElement.contains(event.target as Node)) {
			isSiteNavigationThemePickerOpen.set(false);
		}
	}

	function setTheme(theme: string): void {
		if (theme === "system") {
			localStorage.removeItem("theme");
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			currentTheme.set(systemTheme);
			selectedTheme.set(systemTheme);
			document.documentElement.setAttribute("data-theme", systemTheme);
		} else {
			currentTheme.set(theme);
			localStorage.setItem("theme", theme);
			selectedTheme.set(theme);
			document.documentElement.setAttribute("data-theme", theme);
		}
	}

	onMount(() => {
		const storedTheme = localStorage.getItem("theme") || "system";
		if (storedTheme === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			currentTheme.set(systemTheme);
			selectedTheme.set(systemTheme);
			document.documentElement.setAttribute("data-theme", systemTheme);
		} else {
			currentTheme.set(storedTheme);
			selectedTheme.set(storedTheme);
			document.documentElement.setAttribute("data-theme", storedTheme);
		}

		document.addEventListener("mousedown", handleOutsideClick);
		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	});

	afterUpdate(() => {
		if ($isSiteNavigationThemePickerOpen && firstButton) {
			firstButton.focus();
		}
	});
</script>

{#if $isSiteNavigationThemePickerOpen}
	<button class="fixed inset-0 z-40 cursor-default" on:click={handleOutsideClick} tabindex="-1"></button>
{/if}

<div class="relative z-50" bind:this={navigationThemePickerElement}>
	{#if $isSiteNavigationThemePickerOpen}
		<div class="border-b py-6 border-dynamic-neutral-300 bg-dynamic-neutral-50" transition:slide={{ duration: 375 }}>
			<div class="container mx-auto px-6">
				<div class="block w-full whitespace-nowrap overflow-y-hidden overflow-x-auto text-center">
					{#each ["light", "dark", "black"] as theme}
						<div class="inline-block mr-12">
							<div class="flex flex-col gap-y-3">
								<button class="border border-dynamic-neutral-300" on:click={() => setTheme(theme)} bind:this={firstButton}>
									<div data-theme={theme}>
										<div class="h-20 w-28 overflow-hidden bg-dynamic-neutral-0 size-full">
											<div class="flex flex-col gap-y-2">
												<div class="h-3 bg-dynamic-neutral-50"></div>
												<div class="flex justify-between items-center mx-3">
													<div class="flex gap-x-1">
														<div class="bg-dynamic-neutral-950 size-2"></div>
														<div class="bg-dynamic-article size-2 rounded-full"></div>
														<div class="bg-dynamic-project size-2 rounded-full"></div>
														<div class="bg-dynamic-study size-2 rounded-full"></div>
													</div>
													<div class="bg-dynamic-neutral-300 h-2 w-8 rounded-full"></div>
												</div>
												<div class="bg-dynamic-neutral-100 rounded-md mx-3 h-8"></div>
											</div>
										</div>
									</div>
								</button>
								<span class="text-sm leading-normal text-center text-dynamic-neutral-800 capitalize">{theme}</span>
							</div>
						</div>
					{/each}
					<div class="inline-block">
						<div class="flex flex-col gap-y-3">
							<button class="border border-dynamic-neutral-300" on:click={() => setTheme("system")}>
								<div class="relative">
									<div data-theme="light" class="absolute inset-0" style="clip-path: polygon(100% 0, 0 100%, 0 0);">
										<div class="h-20 w-28 overflow-hidden bg-dynamic-neutral-0 size-full">
											<div class="flex flex-col gap-y-2">
												<div class="h-3 bg-dynamic-neutral-50"></div>
												<div class="flex justify-between items-center mx-3">
													<div class="flex gap-x-1">
														<div class="bg-dynamic-neutral-950 size-2"></div>
														<div class="bg-dynamic-article size-2 rounded-full"></div>
														<div class="bg-dynamic-project size-2 rounded-full"></div>
														<div class="bg-dynamic-study size-2 rounded-full"></div>
													</div>
													<div class="bg-dynamic-neutral-300 h-2 w-8 rounded-full"></div>
												</div>
												<div class="bg-dynamic-neutral-100 rounded-md mx-3 h-8"></div>
											</div>
										</div>
									</div>
									<div data-theme="dark" class="relative" style="clip-path: polygon(100% 100%, 0 100%, 100% 0);">
										<div class="h-20 w-28 overflow-hidden bg-dynamic-neutral-0 size-full">
											<div class="flex flex-col gap-y-2">
												<div class="h-3 bg-dynamic-neutral-50"></div>
												<div class="flex justify-between items-center mx-3">
													<div class="flex gap-x-1">
														<div class="bg-dynamic-neutral-950 size-2"></div>
														<div class="bg-dynamic-article size-2 rounded-full"></div>
														<div class="bg-dynamic-project size-2 rounded-full"></div>
														<div class="bg-dynamic-study size-2 rounded-full"></div>
													</div>
													<div class="bg-dynamic-neutral-300 h-2 w-8 rounded-full"></div>
												</div>
												<div class="bg-dynamic-neutral-100 rounded-md mx-3 h-8"></div>
											</div>
										</div>
									</div>
								</div>
							</button>
							<span class="text-sm leading-normal text-center text-dynamic-neutral-800 capitalize">system</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>
