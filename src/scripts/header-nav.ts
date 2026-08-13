// Controls the mobile header menu: open/close, keyboard, resize, and scroll lock.

const DESKTOP_MQ = '(min-width: 1024px)';

function setOpen(header: HTMLElement, button: HTMLButtonElement, open: boolean) {
	header.toggleAttribute('data-nav-open', open);
	button.setAttribute('aria-expanded', String(open));
	button.setAttribute('aria-label', open ? 'Menü bezárása' : 'Menü megnyitása');
	document.body.classList.toggle('overflow-hidden', open);
}

function initHeaderNav() {
	const header = document.querySelector<HTMLElement>('[data-header]');
	const button = header?.querySelector<HTMLButtonElement>('[data-nav-toggle]');
	const nav = header?.querySelector<HTMLElement>('[data-nav]');

	if (!header || !button || !nav) return;

	button.addEventListener('click', () => {
		setOpen(header, button, !header.hasAttribute('data-nav-open'));
	});

	nav.addEventListener('click', (event) => {
		const target = event.target as HTMLElement;
		if (target.closest('a')) {
			setOpen(header, button, false);
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') {
			setOpen(header, button, false);
		}
	});

	window.matchMedia(DESKTOP_MQ).addEventListener('change', (event) => {
		if (event.matches) {
			setOpen(header, button, false);
		}
	});
}

initHeaderNav();
