<script lang="ts">
	import type { PresentationComponentProps } from '$lib/components/presentation/presentationComponent';
	import { createSlideController } from '$lib/components/presentation/slideUtils.svelte';

	let { onIdle, onNoNextStep, onNoPrevStep }: PresentationComponentProps = $props();

	const slide = createSlideController({
		lastStep: 0,
		onIdle: () => onIdle?.(),
		onNoNextStep: () => onNoNextStep?.(),
		onNoPrevStep: () => onNoPrevStep?.()
	});

	export const slide_in = slide.slide_in;
	export const stepStart = slide.stepStart;
	export const stepForward = slide.stepForward;
	export const stepNth = slide.stepNth;
	export const stepBackward = slide.stepBackward;
	export const stepEnd = slide.stepEnd;
	export const slide_out = slide.slide_out;
	export const outNow = slide.outNow;
</script>

<div
	class="slide-root"
	class:is-visible={slide.visible}
	class:anim-in={slide.animating && slide.direction === 'in'}
	class:anim-out={slide.animating && slide.direction === 'out'}
	onanimationend={slide.handleAnimationEnd}
></div>

<style>
	.slide-root {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		pointer-events: none;
	}

	.slide-root.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.anim-in {
		animation: slide-in 400ms ease;
	}

	.anim-out {
		animation: slide-out 400ms ease forwards;
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(3rem);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-3rem);
		}
	}
</style>