<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	export let className = "";
	export { className as class };

	let navbar: HTMLElement | null = null;
	let showcase: HTMLElement | null = null;

	const checkIntersection = () => {
		if (!navbar || !showcase) return;
		navbar.setAttribute("data-theme", navbar.getBoundingClientRect().bottom >= showcase.getBoundingClientRect().top && navbar.getBoundingClientRect().top <= showcase.getBoundingClientRect().bottom ? "black" : "");
	};

	onMount(() => {
		navbar = document.querySelector("nav");
		showcase = document.getElementById("showcase");
		if (showcase) {
			window.addEventListener("scroll", checkIntersection);
			checkIntersection();
		}
	});

	onDestroy(() => showcase && window.removeEventListener("scroll", checkIntersection));
</script>

<nav class={className} bind:this={navbar}>
	<slot />
</nav>
