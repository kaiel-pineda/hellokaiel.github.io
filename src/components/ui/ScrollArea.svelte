<script lang="ts">
	import { ScrollArea } from "bits-ui";

	let className: string = "";
	export { className as class };
	export let viewportClass: string = "";
	export let scrollbarClass: string = "";
	export let thumbClass: string = "";
	export let orientation: "horizontal" | "vertical" | "both" = "horizontal";
	export let type: "hover" | "scroll" | "auto" | "always" = "auto";
</script>

<ScrollArea.Root class="scroll-area {className}" {type}>
	<ScrollArea.Viewport class="scroll-area-viewport {viewportClass}">
		<slot />
	</ScrollArea.Viewport>

	{#if orientation === "horizontal" || orientation === "both"}
		<ScrollArea.Scrollbar orientation="horizontal" class="scroll-area-scrollbar scroll-area-scrollbar-x {scrollbarClass}">
			<ScrollArea.Thumb class="scroll-area-thumb {thumbClass}" />
		</ScrollArea.Scrollbar>
	{/if}

	{#if orientation === "vertical" || orientation === "both"}
		<ScrollArea.Scrollbar orientation="vertical" class="scroll-area-scrollbar scroll-area-scrollbar-y {scrollbarClass}">
			<ScrollArea.Thumb class="scroll-area-thumb {thumbClass}" />
		</ScrollArea.Scrollbar>
	{/if}

	<ScrollArea.Corner class="scroll-area-corner" />
</ScrollArea.Root>
