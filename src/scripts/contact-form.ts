// Submits the contact form to Formspark with Botpoison spam protection.

const BOTPOISON_PUBLIC_KEY = 'pk_89a0553a-6345-4e19-bd2d-2366c13ff807';
const BOTPOISON_SCRIPT_SRC = 'https://unpkg.com/@botpoison/browser';

interface BotpoisonClient {
	challenge: () => Promise<{ solution: string }>;
}

declare global {
	interface Window {
		Botpoison?: new (options: { publicKey: string }) => BotpoisonClient;
	}
}

function showSuccess(form: HTMLFormElement, success: HTMLElement) {
	form.hidden = true;
	success.hidden = false;
	success.focus();
}

function loadBotpoisonScript(): Promise<void> {
	if (window.Botpoison) return Promise.resolve();

	return new Promise((resolve, reject) => {
		const existing = document.querySelector<HTMLScriptElement>(
			'script[data-botpoison="true"]',
		);
		if (existing) {
			existing.addEventListener('load', () => resolve(), { once: true });
			existing.addEventListener('error', () => reject(new Error('Botpoison failed to load')), {
				once: true,
			});
			return;
		}

		const script = document.createElement('script');
		script.src = BOTPOISON_SCRIPT_SRC;
		script.async = true;
		script.dataset.botpoison = 'true';
		script.onload = () => resolve();
		script.onerror = () => reject(new Error('Botpoison failed to load'));
		document.head.appendChild(script);
	});
}

async function getBotpoisonSolution(): Promise<string> {
	await loadBotpoisonScript();

	if (!window.Botpoison) {
		throw new Error('Botpoison unavailable');
	}

	const botpoison = new window.Botpoison({ publicKey: BOTPOISON_PUBLIC_KEY });
	const result = await botpoison.challenge();
	return result.solution;
}

function initContactForm() {
	const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
	const success = document.querySelector<HTMLElement>('[data-contact-success]');
	const errorEl = document.querySelector<HTMLElement>('[data-contact-error]');
	const submit = form?.querySelector<HTMLButtonElement>('button[type="submit"]');

	if (!form || !success) return;

	const action = form.getAttribute('action');
	if (!action?.startsWith('https://submit-form.com')) return;

	form.addEventListener('submit', async (event) => {
		event.preventDefault();

		submit?.setAttribute('disabled', 'true');
		errorEl?.classList.add('hidden');

		try {
			const solution = await getBotpoisonSolution();
			const body = new URLSearchParams();

			new FormData(form).forEach((value, key) => {
				body.append(key, String(value));
			});
			body.append('_botpoison', solution);

			const response = await fetch(action, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Accept: 'application/json',
				},
				body: body.toString(),
			});

			if (!response.ok) {
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
