// presentationController.svelte.ts
import { tick } from 'svelte';
import type {
	PresentationComponent,
	PresentationComponentInstance
} from './presentationComponent';

type TransitionDirection = 'next' | 'prev';

type TransitionState = {
	id: number;
	direction: TransitionDirection;
	sourceIndex: number;
	targetIndex: number;
};

type Options = {
	Slides: PresentationComponent[];
	onIdle?: () => void;
	onNoNextStep?: () => void;
	onNoPrevStep?: () => void;
};

export function createPresentationController(options: Options) {
	let activeIndex = $state(0);
	let residentCount = $state(0);
	let slideInstances = $state<Array<PresentationComponentInstance | undefined>>([]);
	let transition = $state<TransitionState | null>(null);
	let nextTransitionId = 0;

	function getActiveSlide() {
		return slideInstances[activeIndex];
	}

	function ensureResident(index: number) {
		residentCount = Math.min(options.Slides.length, Math.max(residentCount, index + 1));
	}

	function finalizeTransition(transitionId: number) {
		if (!transition || transition.id !== transitionId) return;

		activeIndex = transition.targetIndex;
		transition = null;
		ensureResident(activeIndex + 1);
		options.onIdle?.();
	}

	function snapTransition() {
		if (!transition) return;

		const { id, sourceIndex, targetIndex } = transition;

		slideInstances[sourceIndex]?.outNow();
		slideInstances[targetIndex]?.stepStart();

		finalizeTransition(id);
	}

	async function startTransition(direction: TransitionDirection) {
		if (transition) return;

		const sourceIndex = activeIndex;
		const targetIndex = direction === 'next' ? sourceIndex + 1 : sourceIndex - 1;

		if (targetIndex < 0) {
			options.onNoPrevStep?.();
			return;
		}

		if (targetIndex >= options.Slides.length) {
			options.onNoNextStep?.();
			return;
		}

		ensureResident(targetIndex);

		const transitionId = ++nextTransitionId;

		transition = {
			id: transitionId,
			direction,
			sourceIndex,
			targetIndex
		};

		await tick();

		if (transition?.id !== transitionId) return;

		const sourceSlide = slideInstances[sourceIndex];
		const targetSlide = slideInstances[targetIndex];

		if (!targetSlide) {
			transition = null;
			return;
		}

		sourceSlide?.slide_out();
		targetSlide.slide_in();
	}

	function advance() {
		if (transition) {
			snapTransition();
			return;
		}

		getActiveSlide()?.stepForward();
	}

	function retreat() {
		if (transition) {
			snapTransition();
			return;
		}

		getActiveSlide()?.stepBackward();
	}

	function handleSlideIdle(index: number) {
		if (transition) {
			if (index !== transition.targetIndex) return;

			finalizeTransition(transition.id);
			return;
		}

		if (index !== activeIndex) return;

		ensureResident(activeIndex + 1);
		options.onIdle?.();
	}

	function handleNoNextStep(index: number) {
		if (index !== activeIndex || transition) return;
		void startTransition('next');
	}

	function handleNoPrevStep(index: number) {
		if (index !== activeIndex || transition) return;
		void startTransition('prev');
	}

	async function startInitialSlide() {
		if (options.Slides.length === 0) return;

		residentCount = 1;
		await tick();

		slideInstances[0]?.slide_in();
	}

	return {
		get activeIndex() {
			return activeIndex;
		},
		get residentCount() {
			return residentCount;
		},
		slideInstances,

		advance,
		retreat,
		startInitialSlide,

		handleSlideIdle,
		handleNoNextStep,
		handleNoPrevStep,

		stepStart: () => getActiveSlide()?.stepStart(),
		stepNth: (index: number) => getActiveSlide()?.stepNth(index) ?? false,
		stepEnd: () => getActiveSlide()?.stepEnd(),
		slideOutNow: () => getActiveSlide()?.outNow()
	};
}