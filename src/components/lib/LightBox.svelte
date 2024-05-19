<script>
	import { onMount } from "svelte";

	let showLightbox = false;

	const toggleLightbox = () => {
		showLightbox = !showLightbox;
		document.body.classList.toggle("overflow-hidden", showLightbox);
	};

	onMount(() => {
		const handleKeydown = (event) => {
			if (event.key === "Escape" && showLightbox) {
				toggleLightbox();
			}
		};

		document.addEventListener("keydown", handleKeydown);

		return () => {
			document.removeEventListener("keydown", handleKeydown);
		};
	});
</script>

<div class="relative">
	<button class="bg-dynamic-neutral-200 fill-dynamic-neutral-800 border border-dynamic-neutral-500 p-3 rounded-md mt-6 mr-6 absolute right-0" on:click={toggleLightbox}>
		<svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 16 16">
			<path
				d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
		</svg>
	</button>
	<slot></slot>
</div>

<div class={`fixed inset-0 bg-dynamic-neutral-0 flex items-center justify-center z-50 ${showLightbox ? "flex" : "hidden"}`}>
	<button class="bg-dynamic-neutral-200 fill-dynamic-neutral-800 border border-dynamic-neutral-500 p-3 rounded-md mt-6 mr-6 absolute top-0 right-0" on:click={toggleLightbox}>
		<svg xmlns="http://www.w3.org/2000/svg" class="size-6" viewBox="0 0 16 16">
			<path
				d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
		</svg>
	</button>
	<div>
		<slot></slot>
	</div>
</div>
