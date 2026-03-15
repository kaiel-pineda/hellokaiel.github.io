export type BottomNavigationBackLink = {
	href: string;
	label: string;
};

export type BottomNavigationContext = {
	eyebrow?: string;
	primary: string;
	secondary?: string;
	href?: string;
};

const collectionBackLinks: Record<string, BottomNavigationBackLink> = {
	blog: { href: "/", label: "Back to index" },
	portfolio: { href: "/", label: "Back to index" },
	research: { href: "/", label: "Back to index" },
	categories: { href: "/categories/", label: "Back to categories" },
	tags: { href: "/tags/", label: "Back to tags" },
};

export function getBottomNavigationBackLink(pathname: string): BottomNavigationBackLink {
	const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";
	return collectionBackLinks[firstSegment] ?? { href: "/", label: "Back to home" };
}
