// Smoothly scrolls same-page hash links with a short, eased duration.

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

function getTargetY(element: HTMLElement) {
	const margin = Number.parseFloat(getComputedStyle(element).scrollMarginTop) || 0;
	const top = element.getBoundingClientRect().top + window.scrollY;
	const maxY = document.documentElement.scrollHeight - window.innerHeight;
	return Math.max(0, Math.min(top - margin, maxY));
}

function stopAnimation() {
	cancelAnimationFrame(animationFrame);
	animationFrame = 0;
}

function scrollToY(targetY: number) {
	stopAnimation();

	const startY = window.scrollY;
	const delta = targetY - startY;

	if (Math.abs(delta) < 1 || prefersReducedMotion()) {
		window.scrollTo({ top: targetY, behavior: 'instant' });
		return;
	}

	const duration = Math.round(
		Math.min(DURATION_MAX_MS, Math.max(DURATION_MIN_MS, Math.abs(delta) * MS_PER_PIXEL)),
	);

	let startTime: number | null = null;

	const step = (now: number) => {
		if (startTime === null) startTime = now;
		const progress = Math.min(1, (now - startTime) / duration);
		window.scrollTo({
			top: startY + delta * easeInOutCubic(progress),
			behavior: 'instant',
		});

		if (progress < 1) {
			animationFrame = requestAnimationFrame(step);
			return;
		}

		animationFrame = 0;
	};

	animationFrame = requestAnimationFrame(step);
}

function samePageHashId(anchor: HTMLAnchorElement) {
	const url = new URL(anchor.href);

	if (url.origin !== window.location.origin || url.pathname !== window.location.pathname) {
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

	scrollToY(getTargetY(target));
	return true;
}

function initSmoothScroll() {
	document.addEventListener('click', (event) => {
		const anchor = (event.target as HTMLElement | null)?.closest('a[href]');
		if (!anchor || event.defaultPrevented || event.button !== 0) return;
		if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

		const id = samePageHashId(anchor);
		if (!id) return;

		if (scrollToHash(id, true)) {
			event.preventDefault();
		}
	});

	window.addEventListener('wheel', stopAnimation, { passive: true });
	window.addEventListener('touchstart', stopAnimation, { passive: true });
}

initSmoothScroll();
