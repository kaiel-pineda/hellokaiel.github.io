import { writable } from "svelte/store";
import type { SiteThemeName, SiteThemePreference } from "../utils/theme";

export const siteThemePreference = writable<SiteThemePreference>("system");
export const resolvedSiteTheme = writable<SiteThemeName>("light");
export const isSiteNavigationThemePickerOpen = writable(false);
export const isSiteNavigationDropdownDropped = writable(false);
