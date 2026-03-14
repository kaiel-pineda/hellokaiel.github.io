export const SITE_THEME_STORAGE_KEY = "theme-preference";
export const LEGACY_SITE_THEME_STORAGE_KEY = "theme";

export const siteThemeNames = ["light", "dark", "black"] as const;

export type SiteThemeName = (typeof siteThemeNames)[number];
export type SiteThemePreference = SiteThemeName | "system";
export type ThemeScopeValue = string | "inherit";

export const defaultSiteThemePreference: SiteThemePreference = "system";

export function isSiteThemeName(value: string): value is SiteThemeName {
	return siteThemeNames.includes(value as SiteThemeName);
}

export function isSiteThemePreference(value: string): value is SiteThemePreference {
	return value === "system" || isSiteThemeName(value);
}

export function resolveSiteThemePreference(preference: SiteThemePreference, prefersDark: boolean): SiteThemeName {
	if (preference === "system") {
		return prefersDark ? "dark" : "light";
	}

	return preference;
}

export function readStoredSiteThemePreference(storage: Storage = window.localStorage): SiteThemePreference {
	const storedPreference = storage.getItem(SITE_THEME_STORAGE_KEY) ?? storage.getItem(LEGACY_SITE_THEME_STORAGE_KEY) ?? defaultSiteThemePreference;
	return isSiteThemePreference(storedPreference) ? storedPreference : defaultSiteThemePreference;
}

export function persistSiteThemePreference(preference: SiteThemePreference, storage: Storage = window.localStorage): void {
	if (preference === "system") {
		storage.removeItem(SITE_THEME_STORAGE_KEY);
		storage.removeItem(LEGACY_SITE_THEME_STORAGE_KEY);
		return;
	}

	storage.setItem(SITE_THEME_STORAGE_KEY, preference);
	storage.removeItem(LEGACY_SITE_THEME_STORAGE_KEY);
}

export function applySiteThemePreference(
	preference: SiteThemePreference,
	root: HTMLElement = document.documentElement,
	prefersDark: boolean = window.matchMedia("(prefers-color-scheme: dark)").matches,
): SiteThemeName {
	const resolvedTheme = resolveSiteThemePreference(preference, prefersDark);

	root.dataset.themePreference = preference;
	root.dataset.theme = resolvedTheme;

	return resolvedTheme;
}
