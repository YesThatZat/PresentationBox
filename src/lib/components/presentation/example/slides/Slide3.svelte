<script lang="ts">
	import type { PresentationComponentProps } from '$lib/components/presentation/presentationComponent';
	import { createSlideController } from '../../slideUtils.svelte';

	let { onIdle, onNoNextStep, onNoPrevStep }: PresentationComponentProps = $props();

	const slide = createSlideController({
		lastStep: 1,
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

{#if slide.visible}
	<div
		class="centre"
		class:anim-in={slide.animating && slide.direction === 'in'}
		class:anim-out={slide.animating && slide.direction === 'out'}
		onanimationend={slide.handleAnimationEnd}
	>
		<h1>Slide Three</h1>

		<p>Step 1: intro content</p>

		{#if slide.step >= 1}
			<div class="reveal">
				<p>Step 2: revealed content</p>
			</div>
		{/if}
	</div>
{/if}

<style>
	.centre {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
	}

	.anim-in {
		animation: slide-in 400ms ease;
	}

	.anim-out {
		animation: slide-out 400ms ease forwards;
	}

	.reveal {
		animation: reveal-in 400ms ease;
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

	@keyframes reveal-in {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
