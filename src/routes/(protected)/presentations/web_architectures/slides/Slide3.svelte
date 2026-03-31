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
		background: color-mix(in srgb, var(--background) 30%, rgb(235, 242, 189));
	}
</style>