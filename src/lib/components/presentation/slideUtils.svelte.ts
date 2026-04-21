// slideUtils.ts
import type { PresentationComponentEventHandler } from '$lib/components/presentation/presentationComponent';

export type SlideDirection = 'idle' | 'in' | 'out' | 'forward' | 'backward';

export type SlideControllerOptions = {
	firstStep?: number;
	lastStep: number;
	onIdle?: PresentationComponentEventHandler;
	onNoNextStep?: PresentationComponentEventHandler;
	onNoPrevStep?: PresentationComponentEventHandler;
};

export type SlideController = {
	get visible(): boolean;
	get step(): number;
	get animating(): boolean;
	get direction(): SlideDirection;

	slide_in(): void;
	stepStart(): void;
	stepForward(): void;
	stepNth(index: number): boolean;
	stepBackward(): void;
	stepEnd(): void;
	slide_out(): void;
	outNow(): void;

	handleAnimationEnd(event: AnimationEvent): void;
};

export function createSlideController(options: SlideControllerOptions): SlideController {
	const firstStep = options.firstStep ?? 0;
	const lastStep = options.lastStep;

	let visible = $state(false);
	let step = $state(firstStep);
	let animating = $state(false);
	let direction = $state<SlideDirection>('idle');
	let pendingIdle = $state(false);

	function finishAnimation() {
		pendingIdle = false;
		animating = false;

		if (direction === 'out') {
			visible = false;
		}

		direction = 'idle';
		options.onIdle?.();
	}

	function beginAnimation(nextDirection: Exclude<SlideDirection, 'idle'>, work: () => void) {
		animating = true;
		direction = nextDirection;
		pendingIdle = true;
		work();
	}

	function snapToStep(targetStep: number) {
		visible = true;
		step = targetStep;
		animating = false;
		direction = 'idle';
		pendingIdle = false;
		options.onIdle?.();
	}

	function slide_in() {
		visible = true;
		beginAnimation('in', () => {
			step = firstStep;
		});
	}

	function stepStart() {
		snapToStep(firstStep);
	}

	function stepForward() {
		if (!visible) {
			slide_in();
			return;
		}

		if (step >= lastStep) {
			options.onNoNextStep?.();
			return;
		}

		beginAnimation('forward', () => {
			step += 1;
		});
	}

	function stepNth(index: number): boolean {
		if (index < firstStep || index > lastStep) {
			return false;
		}

		snapToStep(index);
		return true;
	}

	function stepBackward() {
		if (!visible) {
			options.onNoPrevStep?.();
			return;
		}

		if (step <= firstStep) {
			options.onNoPrevStep?.();
			return;
		}

		beginAnimation('backward', () => {
			step -= 1;
		});
	}

	function stepEnd() {
		snapToStep(lastStep);
	}

	function slide_out() {
		if (!visible) {
			options.onIdle?.();
			return;
		}

		beginAnimation('out', () => {});
	}

	function outNow() {
		visible = false;
		animating = false;
		direction = 'idle';
		pendingIdle = false;
	}

	function handleAnimationEnd(event: AnimationEvent) {
		if (event.target !== event.currentTarget) {
			return;
		}

		if (!pendingIdle) {
			return;
		}

		finishAnimation();
	}

	return {
		get visible() {
			return visible;
		},
		get step() {
			return step;
		},
		get animating() {
			return animating;
		},
		get direction() {
			return direction;
		},
		slide_in,
		stepStart,
		stepForward,
		stepNth,
		stepBackward,
		stepEnd,
		slide_out,
		outNow,
		handleAnimationEnd
	};
}