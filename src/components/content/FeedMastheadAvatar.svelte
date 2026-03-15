<script lang="ts">
	import { onMount } from "svelte";

	const GRID_SIZE = 7;
	const CELL_SIZE = 10;
	const CELL_GAP = 2;
	const GRID_PIXEL_SIZE = GRID_SIZE * CELL_SIZE + (GRID_SIZE - 1) * CELL_GAP;
	const FRAME_INTERVAL = 1000 / 30;

	export let seed = "";

	type Grid = boolean[][];
	type CellNode = {
		opacity: number;
		isAlive: boolean;
		strokeOpacity: number;
		x: number;
		y: number;
	};

	type TemporalBehavior = {
		glowOpacity: number;
		interval: number;
		mutationChance: number;
		ruleVariant: number;
		sweepRotation: number;
		wavePhase: number;
		waveSignature: number;
	};

	let hostElement: HTMLDivElement | null = null;
	let prefersReducedMotion = false;
	let cells: Grid = createSeededGrid(seed);
	let isDocumentVisible = true;
	let isInViewport = true;
	let targetTimeProgress = {
		hour: 0,
		millisecond: 0,
		minute: 0,
		second: 0,
	};
	let displayedTimeProgress = {
		hour: 0,
		millisecond: 0,
		minute: 0,
		second: 0,
	};

	let animationFrame = 0;
	let lastTimestamp = 0;
	let lastEvolutionAt = 0;
	let lastSeed = "";
	let lastGridSignature = "";
	let nextRandom = createRandom(seed);
	let stagnantEvolutionCount = 0;
	let intersectionObserver: IntersectionObserver | null = null;

	function hashSeed(seed: string): number {
		let hash = 2166136261;
		for (const char of seed) {
			hash ^= char.charCodeAt(0);
			hash = Math.imul(hash, 16777619);
		}
		return hash >>> 0;
	}

	function createSeededGrid(seed: string): Grid {
		const nextBit = (() => {
			let state = hashSeed(seed) || 1;
			return () => {
				state ^= state << 13;
				state ^= state >>> 17;
				state ^= state << 5;
				return (state >>> 0) & 1;
			};
		})();

		const grid = Array.from({ length: GRID_SIZE }, () => Array.from({ length: GRID_SIZE }, () => false));
		const halfWidth = Math.ceil(GRID_SIZE / 2);

		for (let row = 0; row < GRID_SIZE; row += 1) {
			for (let column = 0; column < halfWidth; column += 1) {
				const value = nextBit() === 1;
				grid[row][column] = value;
				grid[row][GRID_SIZE - column - 1] = value;
			}
		}

		grid[0][0] = false;
		grid[0][GRID_SIZE - 1] = false;
		grid[GRID_SIZE - 1][0] = false;
		grid[GRID_SIZE - 1][GRID_SIZE - 1] = false;
		grid[Math.floor(GRID_SIZE / 2)][Math.floor(GRID_SIZE / 2)] = true;

		return grid;
	}

	function createRandom(seed: string): () => number {
		let state = hashSeed(seed) || 1;
		return () => {
			state ^= state << 13;
			state ^= state >>> 17;
			state ^= state << 5;
			return (state >>> 0) / 4294967295;
		};
	}

	function getNeighborCount(grid: Grid, row: number, column: number): number {
		let count = 0;

		for (let rowOffset = -1; rowOffset <= 1; rowOffset += 1) {
			for (let columnOffset = -1; columnOffset <= 1; columnOffset += 1) {
				if (rowOffset === 0 && columnOffset === 0) {
					continue;
				}

				const neighborRow = row + rowOffset;
				const neighborColumn = column + columnOffset;

				if (
					neighborRow < 0 ||
					neighborRow >= GRID_SIZE ||
					neighborColumn < 0 ||
					neighborColumn >= GRID_SIZE
				) {
					continue;
				}

				if (grid[neighborRow][neighborColumn]) {
					count += 1;
				}
			}
		}

		return count;
	}

	function mirrorGrid(grid: Grid): Grid {
		const mirrored = grid.map((row) => [...row]);
		const halfWidth = Math.ceil(GRID_SIZE / 2);

		for (let row = 0; row < GRID_SIZE; row += 1) {
			for (let column = 0; column < halfWidth; column += 1) {
				mirrored[row][GRID_SIZE - column - 1] = mirrored[row][column];
			}
		}

		return mirrored;
	}

	function countAliveCells(grid: Grid): number {
		return grid.reduce(
			(total, row) => total + row.reduce((rowTotal, isAlive) => rowTotal + (isAlive ? 1 : 0), 0),
			0,
		);
	}

	function getGridSignature(grid: Grid): string {
		return grid.map((row) => row.map((cell) => (cell ? "1" : "0")).join("")).join("|");
	}

	function revitalizeGrid(grid: Grid, behavior: TemporalBehavior): Grid {
		const revitalized = grid.map((row) => [...row]);
		const halfWidth = Math.ceil(GRID_SIZE / 2);
		const anchorRow = 1 + Math.floor(nextRandom() * (GRID_SIZE - 2));
		const minColumn = halfWidth > 2 ? 1 : 0;
		const maxColumn = halfWidth > 2 ? halfWidth - 2 : halfWidth - 1;
		const anchorColumn =
			minColumn === maxColumn
				? minColumn
				: minColumn + Math.floor(nextRandom() * (maxColumn - minColumn + 1));
		const burstPatterns = [
			[
				[0, 0],
				[-1, 0],
				[1, 0],
				[0, 1],
				[0, -1],
			],
			[
				[0, 0],
				[0, 1],
				[1, 0],
				[1, 1],
				[-1, 0],
			],
			[
				[0, 0],
				[-1, 0],
				[1, 0],
				[0, 1],
				[0, 2],
			],
			[
				[0, 0],
				[-1, 1],
				[0, 1],
				[1, 1],
				[0, -1],
			],
			[
				[0, 0],
				[-1, -1],
				[-1, 0],
				[1, 0],
				[1, 1],
			],
		];
		const pattern = burstPatterns[behavior.ruleVariant % burstPatterns.length];

		for (const [rowOffset, columnOffset] of pattern) {
			const row = anchorRow + rowOffset;
			const column = anchorColumn + columnOffset;
			if (row < 0 || row >= GRID_SIZE || column < 0 || column >= halfWidth) {
				continue;
			}
			revitalized[row][column] = true;
		}

		revitalized[Math.floor(GRID_SIZE / 2)][Math.floor(GRID_SIZE / 2)] = true;
		revitalized[0][0] = false;
		revitalized[0][GRID_SIZE - 1] = false;
		revitalized[GRID_SIZE - 1][0] = false;
		revitalized[GRID_SIZE - 1][GRID_SIZE - 1] = false;
		const mirrored = mirrorGrid(revitalized);
		if (countAliveCells(mirrored) <= 5) {
			const fallback = createSeededGrid(`${seed}::${Date.now()}::${behavior.ruleVariant}`);
			return mirrorGrid(fallback);
		}

		return mirrored;
	}

	function evolveGrid(grid: Grid, behavior: TemporalBehavior): Grid {
		const nextGrid = grid.map((row) => [...row]);
		const halfWidth = Math.ceil(GRID_SIZE / 2);
		const survivalVariants: Array<(neighbors: number) => boolean> = [
			(neighbors) => neighbors === 2 || neighbors === 3,
			(neighbors) => neighbors === 2 || neighbors === 3 || neighbors === 4,
			(neighbors) => neighbors === 3 || neighbors === 4,
			(neighbors) => neighbors === 1 || neighbors === 2 || neighbors === 3,
		];
		const birthVariants: Array<(neighbors: number) => boolean> = [
			(neighbors) => neighbors === 3,
			(neighbors) => neighbors === 3 || neighbors === 4,
			(neighbors) => neighbors === 3 || (neighbors === 2 && nextRandom() > 0.82),
			(neighbors) => neighbors === 2 || neighbors === 3,
		];
		const variantIndex = Math.min(survivalVariants.length - 1, behavior.ruleVariant);
		const survives = survivalVariants[variantIndex];
		const isBorn = birthVariants[variantIndex];

		for (let row = 0; row < GRID_SIZE; row += 1) {
			for (let column = 0; column < halfWidth; column += 1) {
				const isAlive = grid[row][column];
				const neighbors = getNeighborCount(grid, row, column);

				if (isAlive) {
					nextGrid[row][column] = survives(neighbors);
				} else {
					nextGrid[row][column] = isBorn(neighbors);
				}
			}
		}

		if (nextRandom() < behavior.mutationChance) {
			const mutationRow = Math.floor(nextRandom() * GRID_SIZE);
			const mutationColumn = Math.floor(nextRandom() * halfWidth);
			const mutationValue = behavior.mutationChance > 0.26 ? nextRandom() > 0.18 : nextRandom() > 0.42;
			nextGrid[mutationRow][mutationColumn] = mutationValue;
		}

		nextGrid[0][0] = false;
		nextGrid[0][GRID_SIZE - 1] = false;
		nextGrid[GRID_SIZE - 1][0] = false;
		nextGrid[GRID_SIZE - 1][GRID_SIZE - 1] = false;
		nextGrid[Math.floor(GRID_SIZE / 2)][Math.floor(GRID_SIZE / 2)] = true;

		return mirrorGrid(nextGrid);
	}

	function maybeEvolve(timestamp: number): void {
		if (prefersReducedMotion) {
			return;
		}

		if (timestamp - lastEvolutionAt < temporalBehavior.interval) {
			return;
		}

		lastEvolutionAt = timestamp;
		let nextGrid = evolveGrid(cells, temporalBehavior);
		const aliveCount = countAliveCells(nextGrid);
		const nextSignature = getGridSignature(nextGrid);

		if (nextSignature === lastGridSignature) {
			stagnantEvolutionCount += 1;
		} else {
			stagnantEvolutionCount = 0;
		}

		if (aliveCount <= 3 || stagnantEvolutionCount >= 2) {
			nextGrid = revitalizeGrid(nextGrid, temporalBehavior);
			stagnantEvolutionCount = 0;
		}

		lastGridSignature = getGridSignature(nextGrid);
		cells = nextGrid;
	}

	function reseedEvolution(): void {
		const performanceNow = typeof performance !== "undefined" ? Math.round(performance.now()) : 0;
		const timestampSeed = `${Date.now()}:${performanceNow}`;
		nextRandom = createRandom(`${seed}::${timestampSeed}`);
		cells = createSeededGrid(`${seed}::${timestampSeed}`);
		lastEvolutionAt = 0;
		lastGridSignature = getGridSignature(cells);
		stagnantEvolutionCount = 0;
	}

	function syncTimeProgress(): void {
		const now = new Date();
		const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
		const minutes = now.getMinutes() + seconds / 60;
		const hours = (now.getHours() % 12) + minutes / 60;

		targetTimeProgress = {
			hour: hours / 12,
			millisecond: now.getMilliseconds() / 1000,
			minute: minutes / 60,
			second: seconds / 60,
		};
	}

	function stepProgress(current: number, target: number, smoothing: number): number {
		let delta = target - current;

		if (delta > 0.5) {
			delta -= 1;
		} else if (delta < -0.5) {
			delta += 1;
		}

		const next = current + delta * smoothing;
		return (next % 1 + 1) % 1;
	}

	function getWaveWeight(row: number, column: number, behavior: TemporalBehavior): number {
		const normalizedRow = row / (GRID_SIZE - 1);
		const normalizedColumn = column / (GRID_SIZE - 1);
		const centeredRow = normalizedRow - 0.5;
		const centeredColumn = normalizedColumn - 0.5;

		if (behavior.waveSignature === 0) {
			return (Math.sin((normalizedColumn + behavior.wavePhase) * Math.PI * 2) + 1) / 2;
		}

		if (behavior.waveSignature === 1) {
			return (Math.sin((normalizedRow + behavior.wavePhase) * Math.PI * 2) + 1) / 2;
		}

		if (behavior.waveSignature === 2) {
			return (Math.sin((normalizedRow + normalizedColumn + behavior.wavePhase) * Math.PI * 2) + 1) / 2;
		}

		const radialDistance = Math.sqrt(centeredRow * centeredRow + centeredColumn * centeredColumn);
		return (Math.sin((radialDistance * 1.8 + behavior.wavePhase) * Math.PI * 2) + 1) / 2;
	}

	function syncDisplayedTimeProgress(): void {
		displayedTimeProgress = {
			hour: stepProgress(displayedTimeProgress.hour, targetTimeProgress.hour, 0.018),
			millisecond: stepProgress(displayedTimeProgress.millisecond, targetTimeProgress.millisecond, 0.012),
			minute: stepProgress(displayedTimeProgress.minute, targetTimeProgress.minute, 0.026),
			second: stepProgress(displayedTimeProgress.second, targetTimeProgress.second, 0.038),
		};
	}

	function shouldAnimate(): boolean {
		return !prefersReducedMotion && isDocumentVisible && isInViewport;
	}

	$: temporalBehavior = (() => {
		const hourSignature = Math.floor(displayedTimeProgress.hour * 4) % 4;
		const minuteCadence = 440 + (1 - displayedTimeProgress.minute) * 260;
		const secondPressure = 0.1 + displayedTimeProgress.second * 0.22;
		return {
			glowOpacity: 0.04 + displayedTimeProgress.second * 0.04,
			interval: minuteCadence,
			mutationChance: secondPressure,
			ruleVariant: hourSignature,
			sweepRotation: displayedTimeProgress.millisecond * 360,
			wavePhase: displayedTimeProgress.millisecond,
			waveSignature: hourSignature,
		} satisfies TemporalBehavior;
	})();
	$: cellNodes = cells.flatMap((row, rowIndex): CellNode[] =>
		row.map((isAlive, columnIndex) => {
			const waveWeight = getWaveWeight(rowIndex, columnIndex, temporalBehavior);
			const opacity = isAlive ? 0.82 + waveWeight * 0.18 : 0;
			const strokeOpacity = isAlive ? 0.88 + waveWeight * 0.12 : 0;
			return {
				isAlive,
				opacity,
				strokeOpacity,
				x: columnIndex * (CELL_SIZE + CELL_GAP),
				y: rowIndex * (CELL_SIZE + CELL_GAP),
			};
		}),
	);
	$: if (typeof window !== "undefined" && seed && seed !== lastSeed) {
		lastSeed = seed;
		reseedEvolution();
	}

	onMount(() => {
		const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const syncReducedMotionPreference = (): void => {
			prefersReducedMotion = mediaQuery.matches;
			syncAnimationState();
		};
		const handleVisibilityChange = (): void => {
			isDocumentVisible = !document.hidden;
			syncAnimationState();
		};

		const animate = (timestamp: number): void => {
			if (!shouldAnimate()) {
				animationFrame = 0;
				lastTimestamp = 0;
				return;
			}

			if (!lastTimestamp) {
				lastTimestamp = timestamp;
			}

			if (timestamp - lastTimestamp < FRAME_INTERVAL) {
				animationFrame = window.requestAnimationFrame(animate);
				return;
			}

			lastTimestamp = timestamp;
			syncTimeProgress();
			syncDisplayedTimeProgress();
			maybeEvolve(timestamp);
			animationFrame = window.requestAnimationFrame(animate);
		};

		const syncAnimationState = (): void => {
			if (shouldAnimate()) {
				if (!animationFrame) {
					lastTimestamp = 0;
					syncTimeProgress();
					syncDisplayedTimeProgress();
					animationFrame = window.requestAnimationFrame(animate);
				}
				return;
			}

			if (animationFrame) {
				window.cancelAnimationFrame(animationFrame);
				animationFrame = 0;
			}
		};

		syncReducedMotionPreference();
		syncTimeProgress();
		reseedEvolution();
		displayedTimeProgress = { ...targetTimeProgress };
		document.addEventListener("visibilitychange", handleVisibilityChange);
		mediaQuery.addEventListener("change", syncReducedMotionPreference);
		if (typeof IntersectionObserver !== "undefined" && hostElement) {
			intersectionObserver = new IntersectionObserver(
				(entries) => {
					isInViewport = entries[0]?.isIntersecting ?? true;
					syncAnimationState();
				},
				{ threshold: 0.01 },
			);
			intersectionObserver.observe(hostElement);
		}
		syncAnimationState();

		return () => {
			if (animationFrame) {
				window.cancelAnimationFrame(animationFrame);
			}
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			mediaQuery.removeEventListener("change", syncReducedMotionPreference);
			intersectionObserver?.disconnect();
		};
	});
</script>

<div
	bind:this={hostElement}
	class="feed-masthead-avatar"
	aria-hidden="true"
>
	<div class="feed-masthead-avatar-shell">
		<div class="feed-masthead-avatar-ticks"></div>
		<div class="feed-masthead-avatar-sweep" style:transform={`rotate(${temporalBehavior.sweepRotation}deg)`}></div>
	</div>

	<div class="feed-masthead-avatar-grid-wrap" style:transform="translate(-50%, -50%)">
		<div class="feed-masthead-avatar-grid-glow" style:opacity={`calc(var(--feed-avatar-grid-glow-strength, 1) * ${temporalBehavior.glowOpacity})`}></div>

		<svg
			class="feed-masthead-avatar-grid"
			viewBox={`0 0 ${GRID_PIXEL_SIZE} ${GRID_PIXEL_SIZE}`}
			role="presentation"
			shape-rendering="crispEdges"
		>
			{#each cellNodes as cell}
				<rect
					class="feed-masthead-avatar-cell"
					x={cell.x}
					y={cell.y}
					width={CELL_SIZE}
					height={CELL_SIZE}
					rx="1.5"
					style:fill={cell.isAlive ? "rgb(var(--feed-avatar-foreground-rgb, 33 33 33))" : "transparent"}
					style:stroke={cell.isAlive ? `rgba(var(--feed-avatar-foreground-rgb, 33 33 33), ${cell.strokeOpacity})` : "transparent"}
					style:opacity={cell.opacity}
				></rect>
			{/each}
		</svg>
	</div>
</div>

<style>
	.feed-masthead-avatar {
		--feed-avatar-surface-rgb: var(--colors-dynamic-neutral-0, 245 245 245);
		--feed-avatar-surface-elevated-rgb: var(--colors-dynamic-neutral-300, 176 176 176);
		--feed-avatar-surface-highlight-rgb: var(--colors-dynamic-neutral-400, 122 122 122);
		--feed-avatar-border-rgb: var(--colors-dynamic-neutral-300, 176 176 176);
		--feed-avatar-accent-rgb: var(--colors-dynamic-neutral-700, 96 96 96);
		--feed-avatar-foreground-rgb: var(--colors-dynamic-neutral-950, 33 33 33);
		--feed-avatar-surface-elevated-opacity: 0.65;
		--feed-avatar-shell-border-opacity: 0.85;
		--feed-avatar-grid-border-opacity: 0.16;
		--feed-avatar-grid-highlight-opacity: 0.22;
		--feed-avatar-grid-glow-strength: 1;
		position: relative;
		isolation: isolate;
		display: flex;
		height: 7rem;
		width: 7rem;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		border-radius: 9999px;
		border: 2px solid rgb(var(--feed-avatar-foreground-rgb));
		background:
			radial-gradient(circle at 50% 50%, rgba(var(--feed-avatar-surface-elevated-rgb), var(--feed-avatar-surface-elevated-opacity)), transparent 58%),
			rgb(var(--feed-avatar-surface-rgb));
	}

	.feed-masthead-avatar-shell {
		position: absolute;
		inset: 0.42rem;
		border-radius: 9999px;
		border: 1px solid rgba(var(--feed-avatar-border-rgb), var(--feed-avatar-shell-border-opacity));
	}

	.feed-masthead-avatar-ticks {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background:
			conic-gradient(
				from 0deg,
				rgba(var(--feed-avatar-foreground-rgb), 0.75) 0deg 6deg,
				transparent 6deg 56deg,
				rgba(var(--feed-avatar-accent-rgb), 0.72) 56deg 62deg,
				transparent 62deg 128deg,
				rgba(var(--feed-avatar-foreground-rgb), 0.75) 128deg 134deg,
				transparent 134deg 204deg,
				rgba(var(--feed-avatar-accent-rgb), 0.72) 204deg 210deg,
				transparent 210deg 280deg,
				rgba(var(--feed-avatar-foreground-rgb), 0.75) 280deg 286deg,
				transparent 286deg 360deg
			);
		-webkit-mask: radial-gradient(circle, transparent 63%, black 64%, black 68%, transparent 69%);
		mask: radial-gradient(circle, transparent 63%, black 64%, black 68%, transparent 69%);
	}

	.feed-masthead-avatar-sweep {
		position: absolute;
		inset: 0;
		border-radius: inherit;
		background: conic-gradient(
			from -18deg,
			transparent 0deg 316deg,
			rgba(var(--feed-avatar-foreground-rgb), 0.12) 316deg 334deg,
			rgba(var(--feed-avatar-accent-rgb), 0.32) 334deg 345deg,
			rgba(var(--feed-avatar-foreground-rgb), 0.16) 345deg 360deg
		);
		-webkit-mask: radial-gradient(circle, transparent 61.5%, black 63.5%, black 68.5%, transparent 70.5%);
		mask: radial-gradient(circle, transparent 61.5%, black 63.5%, black 68.5%, transparent 70.5%);
		opacity: 0.16;
		transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
	}

	.feed-masthead-avatar-grid-wrap {
		position: absolute;
		left: 50%;
		top: 50%;
		display: flex;
		height: 5rem;
		width: 5rem;
		align-items: center;
		justify-content: center;
		border-radius: 9999px;
		border: 1px solid rgba(var(--feed-avatar-foreground-rgb), var(--feed-avatar-grid-border-opacity));
		background:
			radial-gradient(circle at 50% 50%, rgba(var(--feed-avatar-surface-highlight-rgb), var(--feed-avatar-grid-highlight-opacity)), transparent 72%),
			rgb(var(--feed-avatar-surface-rgb));
	}

	.feed-masthead-avatar-grid-glow {
		position: absolute;
		inset: 0.35rem;
		border-radius: 9999px;
		background: radial-gradient(circle at 50% 50%, rgb(var(--feed-avatar-foreground-rgb)), transparent 72%);
		opacity: 0.04;
	}

	.feed-masthead-avatar-grid {
		position: relative;
		z-index: 1;
		height: 4.15rem;
		width: 4.15rem;
	}

	.feed-masthead-avatar-cell {
		stroke-width: 0.6;
		transition: opacity 220ms ease-out;
	}

	:global([data-theme="dark"] .feed-masthead-avatar),
	:global([data-theme="black"] .feed-masthead-avatar) {
		--feed-avatar-surface-rgb: var(--colors-dynamic-neutral-100, 22 22 22);
		--feed-avatar-surface-elevated-rgb: var(--colors-dynamic-neutral-700, 170 170 170);
		--feed-avatar-surface-highlight-rgb: var(--colors-dynamic-neutral-800, 200 200 200);
		--feed-avatar-border-rgb: var(--colors-dynamic-neutral-700, 170 170 170);
		--feed-avatar-accent-rgb: var(--colors-dynamic-neutral-900, 233 233 233);
		--feed-avatar-surface-elevated-opacity: 0.22;
		--feed-avatar-shell-border-opacity: 0.92;
		--feed-avatar-grid-border-opacity: 0.28;
		--feed-avatar-grid-highlight-opacity: 0.34;
		--feed-avatar-grid-glow-strength: 1.75;
	}

	@media (min-width: 768px) {
		.feed-masthead-avatar {
			height: 8rem;
			width: 8rem;
		}

		.feed-masthead-avatar-grid-wrap {
			height: 5.5rem;
			width: 5.5rem;
		}

		.feed-masthead-avatar-grid {
			height: 4.65rem;
			width: 4.65rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.feed-masthead-avatar-sweep,
		.feed-masthead-avatar-cell {
			transition: none;
		}
	}
</style>
