import { derived, writable } from "svelte/store";

export type SiteTopStripState = {
	height: number;
	isPinned: boolean;
	isVisible: boolean;
};

const initialSiteTopStripState: SiteTopStripState = {
	height: 0,
	isPinned: false,
	isVisible: true,
};

export const siteTopStripState = writable<SiteTopStripState>(initialSiteTopStripState);

export const isBottomDockVisible = derived(siteTopStripState, ($siteTopStripState) => $siteTopStripState.isPinned);

export function resetSiteTopStripState(): void {
	siteTopStripState.set(initialSiteTopStripState);
}
