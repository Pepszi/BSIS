// Opens and closes the references modal, restoring focus and locking background scroll.

function setExpanded(button: HTMLButtonElement, open: boolean) {
	button.setAttribute('aria-expanded', String(open));
}

function initReferencesModal() {
	const dialog = document.querySelector<HTMLDialogElement>('[data-references-modal]');
	const openButton = document.querySelector<HTMLButtonElement>('[data-references-modal-open]');

	if (!dialog || !openButton) return;

	function setScrollLock(locked: boolean) {
		document.documentElement.classList.toggle('overflow-hidden', locked);
		document.body.classList.toggle('overflow-hidden', locked);
	}

	function openModal() {
		dialog.showModal();
		setScrollLock(true);
		setExpanded(openButton, true);
	}

	function closeModal() {
		if (dialog.open) {
			dialog.close();
		}
	}

	openButton.addEventListener('click', openModal);

	dialog.querySelectorAll('[data-references-modal-close]').forEach((control) => {
		control.addEventListener('click', closeModal);
	});

	dialog.addEventListener('click', (event) => {
		if (event.target === dialog) {
			closeModal();
		}
	});

	dialog.addEventListener('close', () => {
		setScrollLock(false);
		setExpanded(openButton, false);
	});
}

initReferencesModal();
