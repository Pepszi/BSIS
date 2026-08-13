// Submits the contact form through FormSubmit AJAX and reveals the in-place success message.

const CONTACT_ENDPOINT = 'https://formsubmit.co/ajax/madacsi.peter.98@gmail.com';

function showSuccess(form: HTMLFormElement, success: HTMLElement) {
	form.hidden = true;
	success.hidden = false;
	success.focus();
}

function initContactForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
	const success = document.querySelector<HTMLElement>('[data-contact-success]');
	const errorEl = document.querySelector<HTMLElement>('[data-contact-error]');
	const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

	if (!form || !success) return;

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		const honey = form.querySelector<HTMLInputElement>('[name="_honey"]');
		if (honey?.value) {
			showSuccess(form, success);
			return;
		}

		const payload: Record<string, string> = {};
		new FormData(form).forEach((value, key) => {
			if (key === '_honey') return;
			payload[key] = String(value);
		});

		submit?.setAttribute('disabled', 'true');
		errorEl?.classList.add('hidden');

		try {
			const response = await fetch(CONTACT_ENDPOINT, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
				},
				body: JSON.stringify(payload),
			});
			const data: { success?: boolean | string } = await response.json();
			const succeeded = data.success === true || data.success === 'true';

			if (!response.ok || !succeeded) {
				throw new Error('Submit failed');
			}

			showSuccess(form, success);
		} catch {
			if (errorEl) {
				errorEl.textContent = 'A küldés nem sikerült. Kérjük, próbálja újra.';
				errorEl.classList.remove('hidden');
			}
			submit?.removeAttribute('disabled');
		}
	});
}

initContactForm();
