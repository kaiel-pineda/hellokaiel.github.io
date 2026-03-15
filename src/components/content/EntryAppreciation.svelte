<script lang="ts">
	import { onMount } from "svelte";
	import {
		getEntryAppreciationCopy,
		getEntryAppreciationStorageKey,
		type EntryAppreciationKind,
	} from "../../utils/entry-appreciation";

	export let entryKey: string;
	export let initialCount = 0;
	export let kind: EntryAppreciationKind = "kudos";
	export let maxCount = 12;

	let count = initialCount;
	let isReady = false;

	$: copy = getEntryAppreciationCopy(kind);
	$: storageKey = getEntryAppreciationStorageKey(entryKey, kind);
	$: countLabel = count === 1 ? copy.singularLabel : copy.pluralLabel;
	$: isAtLimit = count >= maxCount;
	$: actionLabel = isAtLimit ? `${copy.actionLabel} maxed` : copy.actionLabel;

	function handleAppreciation(): void {
		if (isAtLimit) {
			return;
		}

		count += 1;
	}

	onMount(() => {
		localStorage.removeItem(storageKey);

		isReady = true;
	});
</script>

<div class="entry-appreciation-panel" data-ready={isReady}>
	<div class="entry-appreciation-actions">
		<button
			class="entry-appreciation-button"
			type="button"
			on:click={handleAppreciation}
			disabled={!isReady || isAtLimit}
			aria-label={actionLabel}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
				<path d="M8 0a.5.5 0 0 1 .5.5v6.793l2.146-2.147a.5.5 0 1 1 .708.708L9.207 8l2.147 2.146a.5.5 0 0 1-.708.708L8.5 8.707V15.5a.5.5 0 0 1-1 0V8.707l-2.146 2.147a.5.5 0 1 1-.708-.708L6.793 8 4.646 5.854a.5.5 0 1 1 .708-.708L7.5 7.293V.5A.5.5 0 0 1 8 0" />
			</svg>
			<span>{isAtLimit ? "Maxed out" : copy.actionLabel}</span>
		</button>

		<div class="entry-appreciation-counter" aria-live="polite">
			<div class="entry-appreciation-counter-row">
				<span class="entry-appreciation-counter-value">{count}</span>
				<span class="entry-appreciation-counter-label">{countLabel}</span>
			</div>
		</div>
	</div>
</div>
