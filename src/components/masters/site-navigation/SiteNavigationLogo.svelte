<script lang="ts">
	export let className = "";
	export { className as class };
</script>

<a class={`logo ${className}`.trim()} href="/" aria-label="Home">
	<div class="logo-ring" aria-hidden="true"></div>
	<div class="logo-inner" aria-hidden="true"></div>
</a>

<style>
	.logo {
		--logo-foreground: rgb(var(--colors-dynamic-neutral-950, 0 0 0));
		--logo-ring: rgb(var(--colors-dynamic-neutral-950, 0 0 0) / 0.18);
		color: var(--logo-foreground);
		margin: 8px 0;
		flex: 0 0 32px;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 32px;
		min-height: 32px;
		min-width: 32px;
		width: 32px;
		border: 2px solid var(--logo-foreground);
		border-radius: 50%;
		line-height: 1;
		overflow: visible;
		contain: layout;
	}

	.logo-ring {
		position: absolute;
		height: 64px;
		width: 64px;
		border: solid 4px var(--logo-ring);
		border-radius: 50%;
		pointer-events: none;
		animation: logo-ring 2s cubic-bezier(0.215, 0.61, 0.355, 1) both;
	}

	.logo-inner {
		height: 24px;
		width: 24px;
		box-shadow: inset 0 0 0 24px var(--logo-foreground);
		border-radius: 50%;
		animation: logo-pulse 0.3s cubic-bezier(0.215, 0.61, 0.355, 1) both;
	}

	.logo:focus .logo-inner,
	.logo:hover .logo-inner {
		display: none;
	}

	@keyframes logo-ring {
		0% {
			transform: scale(0.5);
		}

		60% {
			opacity: 0;
		}

		70% {
			transform: scale(1);
			opacity: 0;
		}

		100% {
			transform: scale(1);
			opacity: 0;
		}
	}

	@keyframes logo-pulse {
		0% {
			transform: scale(0.5);
		}

		100% {
			transform: scale(1);
		}
	}
</style>
