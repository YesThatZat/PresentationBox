<script lang="ts">
	import type { SlideProps } from '$lib/components/slide_control/slide';
	import Title from './Slide_01/Title.svelte';

	let { phase = 'before', isActive = false }: SlideProps = $props();
</script>

<div class="slide">
	<div
		class="title"
		class:before={phase === 'before' || phase === 'active'}
		class:active={phase === 'active'}
		class:out={phase === 'out'}
	>
	<Title {isActive} title="Web Architecture"></Title>
	</div>
</div>

<style>
	.slide {
		background-color: rgb(151, 198, 228);
	}
</style>
