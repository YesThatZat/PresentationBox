<script lang="ts">
	import { onMount, tick } from 'svelte';
	import type {
		PresentationComponent,
		PresentationComponentInstance,
		PresentationComponentProps
	} from './presentationComponent';

	type Props = PresentationComponentProps & {
		Slides: PresentationComponent[];
	};

	type TransitionDirection = 'next' | 'prev';

	type TransitionState = {
		id: number;
		direction: TransitionDirection;
		sourceIndex: number;
		targetIndex: number;
	};

	let { Slides, onIdle, onNoNextStep, onNoPrevStep }: Props = $props();

	let activeIndex = $state(0);
	let residentCount = $state(0);
	let slideInstances = $state<Array<PresentationComponentInstance | undefined>>([]);
	let transition = $state<TransitionState | null>(null);
	let nextTransitionId = 0;

	function getActiveSlide() {
		return slideInstances[activeIndex];
	}

	function ensureResident(index: number) {
		residentCount = Math.min(Slides.length, Math.max(residentCount, index + 1));
	}

	function finalizeTransition(transitionId: number) {
		if (!transition || transition.id !== transitionId) {
			return;
		}

		activeIndex = transition.targetIndex;
		transition = null;
		ensureResident(activeIndex + 1);
		onIdle?.();
	}

	function snapTransition() {
		if (!transition) {
			return;
		}

		const { id, sourceIndex, targetIndex } = transition;

		const sourceSlide = slideInstances[sourceIndex];
		const targetSlide = slideInstances[targetIndex];

		sourceSlide?.outNow();
		targetSlide?.stepStart();
		finalizeTransition(id);
	}

	async function startTransition(direction: TransitionDirection) {
		if (transition) {
			return;
		}

		const sourceIndex = activeIndex;
		const targetIndex = direction === 'next' ? sourceIndex + 1 : sourceIndex - 1;

		if (targetIndex < 0) {
			onNoPrevStep?.();
			return;
		}

		if (targetIndex >= Slides.length) {
			onNoNextStep?.();
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

		if (!transition || transition.id !== transitionId) {
			return;
		}

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

	function stepStart() {
		getActiveSlide()?.stepStart();
	}

	function stepNth(index: number) {
		return getActiveSlide()?.stepNth(index) ?? false;
	}

	function stepEnd() {
		getActiveSlide()?.stepEnd();
	}

	function slideOutNow() {
		getActiveSlide()?.outNow();
	}

	function handleSlideIdle(index: number) {
		if (transition) {
			if (index !== transition.targetIndex) {
				return;
			}

			finalizeTransition(transition.id);
			return;
		}

		if (index !== activeIndex) {
			return;
		}

		ensureResident(activeIndex + 1);
		onIdle?.();
	}

	function handleNoNextStep(index: number) {
		if (index !== activeIndex || transition) {
			return;
		}

		void startTransition('next');
	}

	function handleNoPrevStep(index: number) {
		if (index !== activeIndex || transition) {
			return;
		}

		void startTransition('prev');
	}

	onMount(() => {
		let cancelled = false;

		const startInitialSlide = async () => {
			if (Slides.length === 0) {
				return;
			}

			residentCount = 1;
			await tick();

			if (cancelled) {
				return;
			}

			slideInstances[0]?.slide_in();
		};

		void startInitialSlide();

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="presentation-container">
	<div class="transport-controls">
		<button onclick={retreat}>Retreat</button>
		<button onclick={advance}>Advance</button>
	</div>

	<div class="presentation">
		{#each Slides.slice(0, residentCount) as SlideComponent, slideIndex (slideIndex)}
			<div class:active-slide={slideIndex === activeIndex} class="slide-host">
				<SlideComponent
					bind:this={slideInstances[slideIndex]}
					onIdle={() => handleSlideIdle(slideIndex)}
					onNoNextStep={() => handleNoNextStep(slideIndex)}
					onNoPrevStep={() => handleNoPrevStep(slideIndex)}
				/>
			</div>
		{/each}
	</div>
</div>

<style>
	.presentation-container {
		position: relative;
		width: 100%;
		height: 100%;
	}

	.presentation {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.slide-host {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.active-slide {
		pointer-events: auto;
	}

	.transport-controls {
		position: absolute;
		inset: 0;
		display: flex;
		justify-content: space-between;
		align-items: stretch;
		pointer-events: none;
		z-index: 10;
	}

	.transport-controls button {
		pointer-events: auto;
	}
</style>
