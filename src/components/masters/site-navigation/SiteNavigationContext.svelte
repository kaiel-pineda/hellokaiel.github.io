<script lang="ts">
	import type { BottomNavigationContext } from "./bottom-navigation";

	export let context: BottomNavigationContext | null = null;
</script>

{#if context}
	{#if context.href}
		<a href={context.href} class="bottom-navigation-context link-focus">
			{#if context.eyebrow}
				<span class="bottom-navigation-context-eyebrow">{context.eyebrow}</span>
			{/if}
			<span class="bottom-navigation-context-primary">{context.primary}</span>
			{#if context.secondary}
				<span class="bottom-navigation-context-secondary">{context.secondary}</span>
			{/if}
		</a>
	{:else}
		<div class="bottom-navigation-context">
			{#if context.eyebrow}
				<span class="bottom-navigation-context-eyebrow">{context.eyebrow}</span>
			{/if}
			<span class="bottom-navigation-context-primary">{context.primary}</span>
			{#if context.secondary}
				<span class="bottom-navigation-context-secondary">{context.secondary}</span>
			{/if}
		</div>
	{/if}
{:else}
	<div class="h-10"></div>
{/if}
