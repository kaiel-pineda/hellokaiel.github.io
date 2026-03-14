export type PrimaryNavigationLink = {
	href: string;
	label: string;
	isActive: boolean;
};

const PRIMARY_NAVIGATION_ITEMS = [
	{ href: "/blog/", label: "Blog" },
	{ href: "/portfolio/", label: "Portfolio" },
	{ href: "/research/", label: "Research" },
] as const;

export function getPrimaryNavigationLinks(pathname: string): PrimaryNavigationLink[] {
	return PRIMARY_NAVIGATION_ITEMS.map((item) => ({
		...item,
		isActive: pathname === item.href || pathname.startsWith(item.href),
	}));
}
