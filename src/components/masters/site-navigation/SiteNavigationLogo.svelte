<script lang="ts">
	export let contained = false;
	export let className = "";
	export { className as class };

	$: anchorClassName = contained ? "group flex size-10 items-center justify-center self-center leading-none" : "group inline-flex";
	$: shellClassName = contained
		? "relative isolate flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dynamic-neutral-950"
		: "relative isolate flex size-8 shrink-0 items-center justify-center overflow-visible rounded-full border-2 border-dynamic-neutral-950";
	$: ringClassName = contained ? "size-8 animate-logo-ring rounded-full border-2 border-dynamic-neutral-200" : "size-16 animate-logo-ring rounded-full border-4 border-dynamic-neutral-200";
</script>

<a class={`${anchorClassName} ${className}`.trim()} href="/" aria-label="Home">
	<div class={shellClassName}>
		<div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<div class={ringClassName}></div>
		</div>
		<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
			<div class="size-6 rounded-full bg-dynamic-neutral-950 transition-opacity duration-300 ease-in-out group-hover:opacity-0 [&:not(:hover)]:animate-logo-inner-grow"></div>
		</div>
	</div>
</a>
