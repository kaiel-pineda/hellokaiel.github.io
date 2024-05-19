<script lang="ts">
	import { isSiteNavigationThemePickerOpen } from "../../global-stores";

	function toggleSiteNavigationThemePicker() {
		isSiteNavigationThemePickerOpen.update((value) => {
			if (value) {
				return false;
			}
			return !value;
		});
	}
</script>

<button class="flex size-[32px] items-center justify-center rounded-full bg-dynamic-neutral-200 fill-dynamic-neutral-800" on:click={toggleSiteNavigationThemePicker}>
	<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
		<path
			d="M0 .5A.5.5 0 0 1 .5 0h5a.5.5 0 0 1 .5.5v5.277l4.147-4.131a.5.5 0 0 1 .707 0l3.535 3.536a.5.5 0 0 1 0 .708L10.261 10H15.5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H3a2.99 2.99 0 0 1-2.121-.879A2.99 2.99 0 0 1 0 13.044m6-.21 7.328-7.3-2.829-2.828L6 7.188v5.647zM4.5 13a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0zM15 15v-4H9.258l-4.015 4H15zM0 .5v12.495V.5z" />
	</svg>
</button>
