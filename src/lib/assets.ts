// Shared public URL for image assets hosted on the R2 CDN.

export const ASSET_BASE = 'https://pub-0772fc56ae8a4a2ab98b0f900fdd1ae0.r2.dev';

export function asset(path: string): string {
	return `${ASSET_BASE}/${path.replace(/^\//, '')}`;
}
