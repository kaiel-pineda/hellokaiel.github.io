<script lang="ts">
	import { isSiteNavigationThemePickerOpen, resolvedSiteTheme, siteThemePreference } from "../../global-stores";
	import { clickOutside } from "../../actions/clickOutside";
	import { onMount, tick } from "svelte";
	import {
		applySiteThemePreference,
		defaultSiteThemePreference,
		persistSiteThemePreference,
		readStoredSiteThemePreference,
		type SiteThemePreference,
	} from "../../../utils/theme";

	let firstButton: HTMLElement | null = null;
	let currentThemePreference: SiteThemePreference = defaultSiteThemePreference;
	let isMounted = false;
	let systemThemeQuery: MediaQueryList | null = null;

	function syncSiteTheme(preference: SiteThemePreference): void {
		currentThemePreference = preference;
		siteThemePreference.set(preference);
		persistSiteThemePreference(preference);

		const resolvedTheme = applySiteThemePreference(preference);
		resolvedSiteTheme.set(resolvedTheme);
	}

	function setTheme(theme: SiteThemePreference): void {
		syncSiteTheme(theme);
	}

	onMount(() => {
		isMounted = true;
		systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

		const handleSystemThemeChange = (): void => {
			if (currentThemePreference === "system") {
				const resolvedTheme = applySiteThemePreference("system");
				resolvedSiteTheme.set(resolvedTheme);
			}
		};

		syncSiteTheme(readStoredSiteThemePreference());
		systemThemeQuery.addEventListener("change", handleSystemThemeChange);
		return () => {
			isMounted = false;
			systemThemeQuery?.removeEventListener("change", handleSystemThemeChange);
		};
	});

	$: if (isMounted && $isSiteNavigationThemePickerOpen) {
		void tick().then(() => firstButton?.focus());
	}
</script>

<div class="grid overflow-hidden border-b border-dynamic-neutral-300 bg-dynamic-neutral-100 transition-[grid-template-rows] duration-300 ease-out" style:grid-template-rows={$isSiteNavigationThemePickerOpen ? "1fr" : "0fr"}>
	<div class="min-h-0 overflow-hidden" use:clickOutside={{ enabled: $isSiteNavigationThemePickerOpen, onOutside: () => isSiteNavigationThemePickerOpen.set(false) }}>
		<div
			class="w-full px-6 py-6 pb-8 transition-transform duration-300 ease-out md:px-8 md:py-8 md:pb-10"
			style:transform={$isSiteNavigationThemePickerOpen ? "translateY(0)" : "translateY(calc(-100% - 1px))"}
			inert={!$isSiteNavigationThemePickerOpen || undefined}
		>
			<div class="block w-full whitespace-nowrap overflow-y-hidden overflow-x-auto text-center">
				{#each (["light", "dark", "black"] as SiteThemePreference[]) as theme (theme)}
					<div class="inline-block mr-12">
						<div class="flex flex-col gap-y-3">
							<button
								class={`border ${currentThemePreference === theme ? "border-dynamic-neutral-950" : "border-dynamic-neutral-300"}`}
								on:click={() => setTheme(theme)}
								bind:this={firstButton}
								aria-label={`Set ${theme} theme`}
							>
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
						<button
							class={`border ${currentThemePreference === "system" ? "border-dynamic-neutral-950" : "border-dynamic-neutral-300"}`}
							on:click={() => setTheme("system")}
							aria-label="Use system theme"
						>
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
</div>
