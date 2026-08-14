// Prefixes internal paths with Astro's base URL for GitHub Pages deployment.

export function withBase(path: string): string {
	if (!path.startsWith('/') || path.startsWith('//')) return path;

	const base = import.meta.env.BASE_URL.endsWith('/')
		? import.meta.env.BASE_URL
		: `${import.meta.env.BASE_URL}/`;

	if (path === '/') return base;

	return `${base}${path.slice(1)}`;
}
