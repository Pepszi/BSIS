// Smoothly scrolls same-page hash links, tracking the live target so image loads cannot miss it.

const DURATION_MIN_MS = 420;
const DURATION_MAX_MS = 560;
const MS_PER_PIXEL = 0.32;

let animationFrame = 0;

function prefersReducedMotion() {
	return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutCubic(t: number) {
	return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function normalizePathname(pathname: string) {
	return pathname.replace(/\/index\.html$/i, '/').replace(/\/+$/, '') || '/';
}

function getTargetY(element: HTMLElement) {
	const header = document.querySelector<HTMLElement>('[data-header]');
	const headerHeight = header?.getBoundingClientRect().height ?? 0;
	const styleMargin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
	const margin = Math.max(styleMargin, headerHeight);
	const top = element.getBoundingClientRect().top + window.scrollY;
	const maxY = document.documentElement.scrollHeight - window.innerHeight;
	return Math.max(0, Math.min(top - margin, maxY));
}

function stopAnimation() {
	cancelAnimationFrame(animationFrame);
	animationFrame = 0;
}

function scrollToElement(element: HTMLElement) {
	stopAnimation();

	const startY = window.scrollY;
	const initialTarget = getTargetY(element);
	const delta = initialTarget - startY;

	if (Math.abs(delta) < 1 || prefersReducedMotion()) {
		window.scrollTo({ top: getTargetY(element), behavior: 'instant' });
		return;
	}

	const duration = Math.round(
		Math.min(DURATION_MAX_MS, Math.max(DURATION_MIN_MS, Math.abs(delta) * MS_PER_PIXEL)),
	);

	let startTime: number | null = null;

	const step = (now: number) => {
		if (startTime === null) startTime = now;
		const progress = Math.min(1, (now - startTime) / duration);
		const targetY = getTargetY(element);
		window.scrollTo({
			top: startY + (targetY - startY) * easeInOutCubic(progress),
			behavior: 'instant',
		});

		if (progress < 1) {
			animationFrame = requestAnimationFrame(step);
			return;
		}

		animationFrame = 0;
		window.scrollTo({ top: getTargetY(element), behavior: 'instant' });
	};

	animationFrame = requestAnimationFrame(step);
}

function samePageHashId(anchor: HTMLAnchorElement) {
	const url = new URL(anchor.href);

	if (url.origin !== window.location.origin) return null;
	if (normalizePathname(url.pathname) !== normalizePathname(window.location.pathname)) {
		return null;
	}

	return url.hash ? decodeURIComponent(url.hash.slice(1)) : null;
}

function scrollToHash(id: string, updateHistory: boolean) {
	const target = document.getElementById(id);
	if (!target) return false;

	if (updateHistory && window.location.hash !== `#${id}`) {
		history.pushState(null, '', `#${id}`);
	}

	scrollToElement(target);
	return true;
}

function alignToHash() {
	const id = window.location.hash ? decodeURIComponent(window.location.hash.slice(1)) : '';
	if (!id) return;

	const target = document.getElementById(id);
	if (!target) return;

	window.scrollTo({ top: getTargetY(target), behavior: 'instant' });
}

function initSmoothScroll() {
	document.addEventListener('click', (event) => {
		const anchor = (event.target as HTMLElement | null)?.closest('a[href]');
		if (!(anchor instanceof HTMLAnchorElement) || event.defaultPrevented || event.button !== 0) {
			return;
		}
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		const id = samePageHashId(anchor);
		if (!id) return;

		if (scrollToHash(id, true)) {
			event.preventDefault();
		}
	});

	window.addEventListener('wheel', stopAnimation, { passive: true });
	window.addEventListener('touchstart', stopAnimation, { passive: true });
	window.addEventListener('load', alignToHash, { once: true });
}

initSmoothScroll();
