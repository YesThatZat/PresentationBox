<script lang="ts">
	import type { SlideProps } from '$lib/components/slide_control/slide';

	let { phase = 'idle', isActive = false }: SlideProps = $props();
</script>

<div class="slide-diagnostic">
	<h1>Slide Diagnostic</h1>
	<span>phase: {phase}</span>
	<span>active: {isActive ? 'yes' : 'no'}</span>
</div>

<style>
	.slide-diagnostic {
        position: absolute;
        bottom:10%;
        right:10%;
		background: var(--background);
        display: flex;
        flex-direction: column;
        padding: 1em;
	}
</style>
