export type PreloadStatus = 'idle' | 'loading' | 'ready' | 'error';

export type SlidePreloader = {
	get preloadStatus(): PreloadStatus;
	get preloadError(): unknown;
	runPreload(): Promise<void>;
};

export function createSlidePreloader(preload?: (() => void | Promise<void>) | undefined): SlidePreloader {
	let preloadStatus = $state<PreloadStatus>('idle');
	let preloadError = $state<unknown>(null);

	async function runPreload() {
		if (!preload) {
			preloadStatus = 'ready';
			preloadError = null;
			return;
		}

		preloadStatus = 'loading';
		preloadError = null;

		try {
			await preload();
			preloadStatus = 'ready';
		} catch (error) {
			preloadStatus = 'error';
			preloadError = error;
		}
	}

	return {
		get preloadStatus() {
			return preloadStatus;
		},
		get preloadError() {
			return preloadError;
		},
		runPreload
	};
}