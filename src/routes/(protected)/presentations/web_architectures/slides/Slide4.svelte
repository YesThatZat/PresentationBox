<script lang="ts">
	import type { SlideProps } from '$lib/components/slide_control/slide';

	let { phase = 'before', isActive = false }: SlideProps = $props();
</script>

<div class="slide">
	<div
		class="title"
		class:before={phase === 'before' || phase === 'active'}
		class:active={phase === 'active'}
		class:out={phase === 'out'}
	>
	</div>
</div>

<style>
	.slide {
		/* CSS may be hard, but never forget life is harder */
		background-color: rebeccapurple;
		color: white;
	}
</style>
