<script lang="ts">
	import SlideAnimator from './SlideAnimator.svelte';
	import type { Direction, SlideEntry } from './slide';

	type Props = {
		slides: SlideEntry[];
	};

	let { slides }: Props = $props();

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
	<div class="controls">
		<button onclick={goPrev} disabled={direction !== null || index <= 0}>Prev</button>
		<button onclick={goNext} disabled={direction !== null || index >= slides.length - 1}
			>Next</button
		>

		<div class="right-align">
			<span>Diagnostics</span>
		</div>
	</div>

	<div class="viewport">
		<SlideAnimator
			lastSlide={index > 0 ? slides[index - 1] : null}
			currentSlide={slides[index]}
			nextSlide={index < slides.length - 1 ? slides[index + 1] : null}
			{direction}
			onTransitionEnd={handleTransitionEnd}
		/>
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
</style>
