<script lang="ts">
	import SlideAnimator from './SlideAnimator.svelte';
	import type { Direction, SlideEntry } from './slide';

	type Props = {
		slides: SlideEntry[];
		showDebugNavigation?: boolean
	};

	let { slides, showDebugNavigation = true }: Props = $props();

	let index = $state(0);
	let direction = $state<Direction>(null);

	function goNext() {
		if (direction) return;
		if (index >= slides.length - 1) return;
		direction = 'next';
	}

	function goPrev() {
		if (direction) return;
		if (index <= 0) return;
		direction = 'prev';
	}

	function handleTransitionEnd() {
		if (direction === 'next') index += 1;
		if (direction === 'prev') index -= 1;
		direction = null;
	}
</script>

<div class="slide-deck">
	{#if showDebugNavigation}
	<div class="controls">
		<button onclick={goPrev} disabled={direction !== null || index <= 0}>Prev</button>
		<button onclick={goNext} disabled={direction !== null || index >= slides.length - 1}
			>Next</button
		>

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
		<button class="band back-band" onclick={goPrev} disabled={direction !== null || index <= 0}>
			<span>&lt;</span>
		</button>
		<button class="band forward-band" onclick={goNext} disabled={direction !== null || index >= slides.length - 1}>
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
		mix-blend-mode:multiply;
		opacity: 0;
		transition: opacity 0.12s ease-in-out;
	}

	.back-band {
		position: absolute;
		left:0;
		top:0;
	}

	.forward-band {
		position: absolute;
		right:0;
		top:0;
	}

	.band:hover {
		background-color: rgb(179, 255, 255);
		opacity: 1;
	}
</style>
