<script lang="ts">
	import { onMount } from "svelte";

	let isOpen = false;
	let previewElement: HTMLDivElement | null = null;
	let lightboxImageSrc = "";
	let lightboxImageAlt = "";

	function syncPreviewImage(): void {
		const previewImage = previewElement?.querySelector("img");

		lightboxImageSrc = previewImage?.currentSrc || previewImage?.src || "";
		lightboxImageAlt = previewImage?.alt || "";
	}

	function setBodyScrollLock(locked: boolean): void {
		document.body.classList.toggle("overflow-hidden", locked);
	}

	function openLightbox(): void {
		syncPreviewImage();

		if (!lightboxImageSrc) {
			return;
		}

		isOpen = true;
		setBodyScrollLock(true);
	}

	function closeLightbox(): void {
		isOpen = false;
		setBodyScrollLock(false);
	}

	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === "Escape" && isOpen) {
			closeLightbox();
		}
	}

	function handleOverlayClick(event: MouseEvent): void {
		if (event.target === event.currentTarget) {
			closeLightbox();
		}
	}

	function handlePreviewKeydown(event: KeyboardEvent): void {
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			openLightbox();
		}
	}

	onMount(() => {
		syncPreviewImage();
		document.addEventListener("keydown", handleKeydown);
		return () => {
			document.removeEventListener("keydown", handleKeydown);
			setBodyScrollLock(false);
		};
	});
</script>

<div class="relative">
	<button
		class="floating-action absolute right-6 top-6 z-10 border-dynamic-neutral-700 bg-dynamic-neutral-100"
		type="button"
		on:click={openLightbox}
		aria-label="Open image lightbox"
	>
		<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
			<path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5" />
		</svg>
	</button>

	<div bind:this={previewElement} class="cursor-zoom-in" role="button" tabindex="0" on:click={openLightbox} on:keydown={handlePreviewKeydown}>
		<slot />
	</div>
</div>

{#if isOpen}
	<div
		class="fixed inset-0 z-[60] flex bg-dynamic-neutral-0"
		role="dialog"
		aria-modal="true"
		aria-label="Image lightbox"
		tabindex="-1"
		on:click={handleOverlayClick}
		on:keydown={handleKeydown}
	>
		<button
			class="floating-action absolute right-6 top-6 z-10 border-dynamic-neutral-700 bg-dynamic-neutral-100"
			type="button"
			on:click={closeLightbox}
			aria-label="Close lightbox"
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z" />
			</svg>
		</button>

		<div class="flex min-h-full w-full items-center justify-center px-6 py-24">
			<div class="flex max-h-full w-full max-w-7xl flex-col items-center gap-y-6">
				<img
					class="max-h-[calc(100vh-12rem)] w-auto max-w-full object-contain"
					src={lightboxImageSrc}
					alt={lightboxImageAlt}
				/>

				{#if lightboxImageAlt}
					<p class="max-w-3xl text-center text-dynamic-neutral-900">
						{lightboxImageAlt}
					</p>
				{/if}
			</div>
		</div>
	</div>
{/if}
