export function resolveIntersectingNavigationTheme(navigationElement: HTMLElement): string | undefined {
	const navigationRect = navigationElement.getBoundingClientRect();
	const themedSections = Array.from(document.querySelectorAll<HTMLElement>("[data-navigation-theme]"));
	const intersectingSection = themedSections.find((section) => {
		const sectionRect = section.getBoundingClientRect();
		return navigationRect.bottom >= sectionRect.top && navigationRect.top <= sectionRect.bottom;
	});

	return intersectingSection?.dataset.navigationTheme;
}

