<script lang="ts">
	import { onMount } from 'svelte'
	import Graph from 'graphology'
	import type GraphType from 'graphology'
	import type { PresentationComponentProps } from '$lib/components/presentation/presentationComponent'
	import { createSlideController } from '$lib/components/presentation/slideUtils.svelte'
	import SigmaGraph from '$lib/components/sigmaGraph/SigmaGraph.svelte'

	let { onIdle, onNoNextStep, onNoPrevStep }: PresentationComponentProps = $props()

	const slide = createSlideController({
		lastStep: 1,
		onIdle: () => onIdle?.(),
		onNoNextStep: () => onNoNextStep?.(),
		onNoPrevStep: () => onNoPrevStep?.()
	})

	const DATA_URL =
		'https://raw.githubusercontent.com/jacomyal/sigma.js/main/packages/storybook/stories/_data/data.json'

	let graph = $state<GraphType | null>(null)
	let graphLoading = $state(true)
	let graphError = $state<string | null>(null)

	onMount(() => {
		let cancelled = false

		const preloadGraph = async () => {
			graphLoading = true
			graphError = null

			try {
				const response = await fetch(DATA_URL)

				if (!response.ok) {
					throw new Error(`Failed to fetch graph data: ${response.status} ${response.statusText}`)
				}

				const serializedGraph = await response.json()

				if (cancelled) {
					return
				}

				const nextGraph = new Graph()
				nextGraph.import(serializedGraph)
				graph = nextGraph
			} catch (error) {
				if (cancelled) {
					return
				}

				graphError = error instanceof Error ? error.message : String(error)
			} finally {
				if (!cancelled) {
					graphLoading = false
				}
			}
		}

		void preloadGraph()

		return () => {
			cancelled = true
		}
	})

	export const slide_in = slide.slide_in
	export const stepStart = slide.stepStart
	export const stepForward = slide.stepForward
	export const stepNth = slide.stepNth
	export const stepBackward = slide.stepBackward
	export const stepEnd = slide.stepEnd
	export const slide_out = slide.slide_out
	export const outNow = slide.outNow
</script>

<div
	class="slide-root"
	class:is-visible={slide.visible}
	class:anim-in={slide.animating && slide.direction === 'in'}
	class:anim-out={slide.animating && slide.direction === 'out'}
	onanimationend={slide.handleAnimationEnd}
>
	<div class="layout">
		<div class="header">
			<h1>Slide Two</h1>
			<p>Status: {graphError ? 'error' : graphLoading ? 'loading' : 'ready'}</p>
		</div>

		<div class="graph-panel">
			<SigmaGraph graph={graph} loading={graphLoading} error={graphError} />
		</div>

		{#if slide.step >= 1}
			<div class="reveal">
				<p>Step 2: revealed content</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.slide-root {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		pointer-events: none;
	}

	.slide-root.is-visible {
		opacity: 1;
		pointer-events: auto;
	}

	.layout {
		width: 100%;
		height: 100%;
		display: grid;
		grid-template-rows: auto 1fr auto;
		gap: 1rem;
		padding: 1rem;
		box-sizing: border-box;
	}

	.graph-panel {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 0;
	}

	.anim-in {
		animation: slide-in 400ms ease;
	}

	.anim-out {
		animation: slide-out 400ms ease forwards;
	}

	.reveal {
		animation: reveal-in 400ms ease;
	}

	@keyframes slide-in {
		from {
			opacity: 0;
			transform: translateX(3rem);
		}
		to {
			opacity: 1;
			transform: translateX(0);
		}
	}

	@keyframes slide-out {
		from {
			opacity: 1;
			transform: translateX(0);
		}
		to {
			opacity: 0;
			transform: translateX(-3rem);
		}
	}

	@keyframes reveal-in {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>