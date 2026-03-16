<script lang="ts">
	import SlideAnimator from './SlideAnimator.svelte';
	import type { Direction, SlideEntry } from './slide';
	import { onMount } from 'svelte';

	type Props = {
		slides: SlideEntry[];
		showDebugNavigation?: boolean;
	};

	let { slides, showDebugNavigation = true }: Props = $props();

	let index = $state(0);
	let direction = $state<Direction>(null);

	function finishTransition() {
		if (direction === 'next' && index < slides.length - 1) {
			index += 1;
		} else if (direction === 'prev' && index > 0) {
			index -= 1;
		}

		direction = null;
	}

	function cancelTransition() {
		direction = null;
	}

	function goNext() {
		if (direction === 'next') {
			// Same direction clicked again:
			// make the incoming slide the current slide immediately
			finishTransition();
			return;
		}

		if (direction === 'prev') {
			// Opposite direction clicked:
			// abandon the in-progress transition and snap back
			cancelTransition();
			return;
		}

		if (index >= slides.length - 1) return;
		direction = 'next';
	}

	function goPrev() {
		if (direction === 'prev') {
			// Same direction clicked again:
			// make the incoming slide the current slide immediately
			finishTransition();
			return;
		}

		if (direction === 'next') {
			// Opposite direction clicked:
			// abandon the in-progress transition and snap back
			cancelTransition();
			return;
		}

		if (index <= 0) return;
		direction = 'prev';
	}

	function handleTransitionEnd() {
		finishTransition();
	}

	onMount(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === 'ArrowRight') goNext();
			if (e.key === 'ArrowLeft') goPrev();
		};

		window.addEventListener('keydown', handler);
		return () => window.removeEventListener('keydown', handler);
	});
</script>

<div class="slide-deck">
	{#if showDebugNavigation}
		<div class="controls">
			<button onclick={goPrev} disabled={index <= 0 && direction === null}>Prev</button>
			<button onclick={goNext} disabled={index >= slides.length - 1 && direction === null}>
				Next
			</button>

			<div class="right-align">
				<span>Diagnostics</span>
			</div>
		</div>
	{/if}

	<div class="viewport">
		<SlideAnimator
			lastSlide={index > 0 ? slides[index - 1] : null}
			currentSlide={slides[index]}
			nextSlide={index < slides.length - 1 ? slides[index + 1] : null}
			{direction}
			onTransitionEnd={handleTransitionEnd}
		/>

		<button class="band back-band" onclick={goPrev} disabled={index <= 0 && direction === null}>
			<span>&lt;</span>
		</button>

		<button
			class="band forward-band"
			onclick={goNext}
			disabled={index >= slides.length - 1 && direction === null}
		>
			<span>&gt;</span>
		</button>
	</div>
</div>

<style>
	.slide-deck {
		display: flex;
		flex-direction: column;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.controls {
		display: flex;
		gap: 0.5rem;
		padding: 0.5rem;
		flex: 0 0 auto;
		z-index: 1;
	}

	.viewport {
		position: relative;
		flex: 1;
		min-height: 0;
	}

	.right-align {
		margin-left: auto;
	}

	.band {
		z-index: 9999;
		height: 100%;
		width: 6em;
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
		align-items: center;
		font-size: large;
		background-color: rgb(179, 255, 255);
		mix-blend-mode: multiply;
		opacity: 0;
		transition: opacity 0.12s ease-in-out;
	}

	.back-band {
		position: absolute;
		left: 0;
		top: 0;
	}

	.forward-band {
		position: absolute;
		right: 0;
		top: 0;
	}

	.band:hover {
		background-color: rgb(179, 255, 255);
		opacity: 1;
	}
</style>
