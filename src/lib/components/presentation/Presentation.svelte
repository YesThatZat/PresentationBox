<script lang="ts">
	import { onMount } from 'svelte';
	import type { PresentationComponent, PresentationComponentProps } from './presentationComponent';
	import { createPresentationController } from './presentationController.svelte';
	import Transport from './transport/Transport.svelte';

	type Props = PresentationComponentProps & {
		Slides: PresentationComponent[];
	};

	let { Slides, onIdle, onNoNextStep, onNoPrevStep }: Props = $props();

	const presentation = createPresentationController({
		Slides,
		onIdle: () => onIdle?.(),
		onNoNextStep: () => onNoNextStep?.(),
		onNoPrevStep: () => onNoPrevStep?.()
	});

	onMount(() => {
		let cancelled = false;

		void presentation.startInitialSlide().then(() => {
			if (cancelled) return;
		});

		return () => {
			cancelled = true;
		};
	});
</script>

<div class="presentation-container">
	<div class="presentation">
		{#each Slides.slice(0, presentation.residentCount) as SlideComponent, slideIndex (slideIndex)}
			<div class:active-slide={slideIndex === presentation.activeIndex} class="slide-host">
				<SlideComponent
					bind:this={presentation.slideInstances[slideIndex]}
					onIdle={() => presentation.handleSlideIdle(slideIndex)}
					onNoNextStep={() => presentation.handleNoNextStep(slideIndex)}
					onNoPrevStep={() => presentation.handleNoPrevStep(slideIndex)}
				/>
			</div>
		{/each}
	</div>
	<Transport onForward={presentation.advance} onBackward={presentation.retreat} />
</div>
