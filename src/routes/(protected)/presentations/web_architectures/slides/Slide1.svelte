<script lang="ts">
	import type { SlideProps } from '$lib/components/slide_control/slide';
	import TestSlideTitle from './TestSlideTitle.svelte';

	let { phase = 'before', isActive = false }: SlideProps = $props();
</script>

<div class="slide">
	<div
		class="title"
		class:before={phase === 'before' || phase === 'active'}
		class:active={phase === 'active'}
		class:out={phase === 'out'}
	>
		<TestSlideTitle {isActive} title={"One"} />
	</div>
</div>

<style>
	.slide {
		background-color: rgb(151, 198, 228);
	}
</style>