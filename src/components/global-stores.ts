import { writable } from "svelte/store";

export const selectedTheme = writable("light");
export const isSiteNavigationThemePickerOpen = writable(false);
export const isSiteNavigationDropdownDropped = writable(false);
