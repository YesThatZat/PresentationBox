<script lang="ts">
	import './Slide.css'
	import type { SlideEntry } from '$lib/components/slide_control/slide';
	import SlideDeck from '$lib/components/slide_control/SlideDeck.svelte';

	import Slide1 from './slides/Slide1.svelte';
	import Slide2 from './slides/Slide2.svelte';
	import Slide3 from './slides/Slide3.svelte';
	import Slide4 from './slides/Slide4.svelte';

	const slides: SlideEntry[] = [
		{ id: 'slide-1', component: Slide1 },
		{ id: 'slide-2', component: Slide2 },
		{ id: 'slide-3', component: Slide3 },
		{ id: 'slide-4', component: Slide4 }
	];
</script>

<SlideDeck {slides} />

<style>
	:global(.slide) {
		width: 100%;
		height: 100%;
	}
</style>