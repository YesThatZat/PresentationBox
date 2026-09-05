<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentationComponentProps } from '$lib/components/presentation/presentationComponent';
	import { createSlideController } from '$lib/components/presentation/slideUtils.svelte';
	import { createSlidePreloader } from '$lib/components/presentation/slidePreload.svelte';
	import InteractiveSigmaGraph from '$lib/components/interactiveSigmaGraph/InteractiveSigmaGraph.svelte';

	let { onIdle, onNoNextStep, onNoPrevStep }: PresentationComponentProps = $props();

	const slide = createSlideController({
		lastStep: 0,
		onIdle: () => onIdle?.(),
		onNoNextStep: () => onNoNextStep?.(),
		onNoPrevStep: () => onNoPrevStep?.()
	});

	const preloader = createSlidePreloader(async () => {
		await Promise.resolve();
	});

	onMount(() => {
		void preloader.runPreload();
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
>
	<div class="centre">
		<h1>Slide Four</h1>

		<div class="tilted-graph">
			<InteractiveSigmaGraph />
		</div>

		{#if preloader.preloadError}
			<p>Preload failed.</p>
		{/if}
	</div>
</div>

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

	.centre {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1rem;
		min-height: 0;
	}

	.tilted-graph {
		width: 100%;
		flex: 1;
		min-height: 0;
		perspective: 1100px;
		overflow: hidden;
	}

	.tilted-graph :global(.sigma-graph) {
		width: 100%;
		height: 100%;
	}

	.tilted-graph :global(.sigma-container) {
		width: 100%;
		height: 100%;
		transform-origin: center;
		transform-style: preserve-3d;
		will-change: transform;
		pointer-events: none;
		animation: spin-tilted-graph 14s linear infinite;
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

	@keyframes spin-tilted-graph {
		from {
			transform: rotateX(58deg) rotateZ(0turn) scale(0.82);
		}

		to {
			transform: rotateX(58deg) rotateZ(1turn) scale(0.82);
		}
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

	@media (prefers-reduced-motion: reduce) {
		.tilted-graph :global(.sigma-container) {
			animation: none;
			transform: rotateX(58deg) rotateZ(-10deg) scale(0.82);
		}
	}
</style>