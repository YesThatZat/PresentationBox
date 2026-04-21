<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentationComponentProps } from '$lib/components/presentation/presentationComponent';
	import { createSlideController } from '$lib/components/presentation/slideUtils.svelte';
	import { createSlidePreloader } from '$lib/components/presentation/slidePreload.svelte';

	let { onIdle, onNoNextStep, onNoPrevStep }: PresentationComponentProps = $props();

	const slide = createSlideController({
		lastStep: 1,
		onIdle: () => onIdle?.(),
		onNoNextStep: () => onNoNextStep?.(),
		onNoPrevStep: () => onNoPrevStep?.()
	});

	const preloader = createSlidePreloader(async () => {
		// Placeholder for real preload work
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

{#if preloader.preloadError}
	<p>Preload failed.</p>
{:else}
	<div
		class="slide-root"
		class:is-visible={slide.visible}
		class:anim-in={slide.animating && slide.direction === 'in'}
		class:anim-out={slide.animating && slide.direction === 'out'}
		onanimationend={slide.handleAnimationEnd}
	>
		<div class="layer">
			<img class="background" src="/example_slides/Background.jpg" alt="An 1800s American Street" />
		</div>
		<div class="layer">
			<div class="mencken-container">
				<div class="mencken-quote">
					<span>For every complex problem</span>
					<span>there is an answer</span>
					<span>that is clear, simple</span>
					<div class="reveal" class:is-revealed={slide.step >= 1}>
						<span>and wrong.</span>
					</div>
				</div>
				<img class="mencken" src="/example_slides/H-L-Mencken.jpg" alt="H-L Mencken.jpg" />
			</div>
		</div>
	</div>
{/if}

<style>
	.slide-root {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		pointer-events: none;
	}

	.layer {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.background {
		object-fit: cover;
		width: 100%;
		height: 100%;
		filter: blur(8px) brightness(0.67) contrast(0.86);
	}

	.mencken-container {
		width: 100%;
		height: 100%;
		display: flex;
		flex-grow: 1;
		align-items: center;
		justify-content: center;
		gap: 2em;
	}

	.mencken-quote {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		justify-content: flex-start;
		min-height: 20vh;
		font-family: Arial, Helvetica, sans-serif;
		font-size: 3em;
		font-weight: 900;
		text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
		color: rgb(180, 255, 220);
	}

	.mencken-container img {
		height: 70vh;
		display: block;
		border-radius: 12px;
		box-shadow: 0 0 20px rgba(0, 0, 0, 0.35);
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

	.reveal {
		opacity: 0;
		transform: translateY(1rem);
		pointer-events: none;
	}

	.reveal.is-revealed {
		animation: reveal-in 400ms ease forwards;
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
