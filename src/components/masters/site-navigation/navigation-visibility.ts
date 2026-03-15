const navigationHideAttribute = "data-navigation-hide";

function getIntersectingNavigationHideSection(navigationElement: HTMLElement): HTMLElement | undefined {
	const navigationRect = navigationElement.getBoundingClientRect();
	const hideSections = Array.from(document.querySelectorAll<HTMLElement>(`[${navigationHideAttribute}]`));

	return hideSections.find((section) => {
		const sectionRect = section.getBoundingClientRect();
		return navigationRect.bottom >= sectionRect.top && navigationRect.top <= sectionRect.bottom;
	});
}

export function shouldHideNavigationElement(navigationElement: HTMLElement, target: string): boolean {
	const intersectingSection = getIntersectingNavigationHideSection(navigationElement);
	const hiddenTargets = intersectingSection?.dataset.navigationHide?.split(/\s+/).filter(Boolean) ?? [];

	return hiddenTargets.includes(target);
}
