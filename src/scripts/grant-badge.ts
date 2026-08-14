// Hides the fixed grant badge when the user scrolls near the bottom of the page.

const BOTTOM_THRESHOLD = 100;
const FADE_DURATION_MS = 150;

function initGrantBadge() {
	const badge = document.querySelector<HTMLElement>('[data-grant-badge]');
	if (!badge) return;

	let isHiding = false;

	const toggleVisibility = () => {
		const scrollPosition = window.innerHeight + window.scrollY;
		const pageHeight = document.documentElement.scrollHeight;
		const distanceFromBottom = pageHeight - scrollPosition;

		if (distanceFromBottom <= BOTTOM_THRESHOLD) {
			if (badge.style.display !== 'none' && !isHiding) {
				isHiding = true;
				badge.style.opacity = '0';
				window.setTimeout(() => {
					if (isHiding) {
						badge.style.display = 'none';
						isHiding = false;
					}
				}, FADE_DURATION_MS);
			}
			return;
		}

		isHiding = false;
		if (badge.style.display === 'none') {
			badge.style.display = 'block';
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					badge.style.opacity = '1';
				});
			});
		}
	};

	window.addEventListener('scroll', toggleVisibility, { passive: true });
	toggleVisibility();
}

initGrantBadge();
