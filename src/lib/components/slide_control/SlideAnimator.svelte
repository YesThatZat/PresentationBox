<script lang="ts">
	import type { Direction, SlideEntry, SlidePhase } from './slide';

	type Props = {
		lastSlide: SlideEntry | null;
		currentSlide: SlideEntry;
		nextSlide: SlideEntry | null;
		direction: Direction;
		onTransitionEnd?: () => void;
	};

	let { lastSlide, currentSlide, nextSlide, direction, onTransitionEnd }: Props = $props();

	function handleTransitionEnd(event: TransitionEvent) {
		if (event.propertyName !== 'transform') return;
		if (!direction) return;
		if (event.target !== event.currentTarget) return;
		console.log("Transition End")
		onTransitionEnd?.();
	}

	function getLastPhase(): SlidePhase {
		return direction === 'prev' ? 'active' : 'before';
	}

	function getCurrentPhase(): SlidePhase {
		return direction ? 'out' : 'active';
	}

	function getNextPhase(): SlidePhase {
		return direction === 'next' ? 'active' : 'before';
	}
</script>

<div class="slide-switcher">
	{#if lastSlide}
		{#key `last-${lastSlide.id}`}
			<div
				class="slide"
				class:animating={!!direction}
				class:prev-slide={direction !== 'prev'}
				class:current-slide={direction === 'prev'}
				class:exit-to-left={direction === 'next'}
			>
				<lastSlide.component phase={getLastPhase()} isActive={false} />
			</div>
		{/key}
	{/if}

	{#key `current-${currentSlide.id}`}
		<div
			class="slide current-slide"
			class:animating={!!direction}
			class:exit-to-left={direction === 'next'}
			class:exit-to-right={direction === 'prev'}
			ontransitionend={handleTransitionEnd}
		>
			<currentSlide.component phase={getCurrentPhase()} isActive={true} />
		</div>
	{/key}

	{#if nextSlide}
		{#key `next-${nextSlide.id}`}
			<div
				class="slide"
				class:animating={!!direction}
				class:next-slide={direction !== 'next'}
				class:current-slide={direction === 'next'}
			>
				<nextSlide.component phase={getNextPhase()} isActive={false} />
			</div>
		{/key}
	{/if}
</div>

<style>
	.slide-switcher {
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.slide {
		position: absolute;
		inset: 0;
	}

	.slide.animating {
		transition: transform 2s ease-in-out;
	}

	.prev-slide {
		transform: translateX(-100%);
	}

	.current-slide {
		transform: translateX(0);
	}

	.next-slide {
		transform: translateX(100%);
	}

	.exit-to-left {
		transform: translateX(-100%);
	}

	.exit-to-right {
		transform: translateX(100%);
	}
</style>
