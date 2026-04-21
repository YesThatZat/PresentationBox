<script lang="ts">
	import { browser } from '$app/environment'
	import type Graph from 'graphology'
	import type { Settings } from 'sigma/settings'

	type Props = {
		graph: Graph | null
		loading?: boolean
		error?: string | null
		settings?: Partial<Settings>
	}

	let {
		graph,
		loading = false,
		error = null,
		settings = {}
	}: Props = $props()

	let container = $state<HTMLDivElement | null>(null)

	// Deliberately NOT reactive state.
	let renderer: Awaited<ReturnType<typeof createRenderer>> | null = null
	let resizeObserver: ResizeObserver | null = null

	async function createRenderer(target: HTMLDivElement, graph: Graph) {
		const { default: Sigma } = await import('sigma')

		return new Sigma(graph, target, {
			renderEdgeLabels: false,
			labelRenderedSizeThreshold: 12,
			allowInvalidContainer: false,
			...settings
		})
	}

	function destroyRenderer() {
		resizeObserver?.disconnect()
		resizeObserver = null

		renderer?.kill()
		renderer = null
	}

	$effect(() => {
		if (!browser || !container || !graph) {
			return
		}

		let cancelled = false

		const target = container
		const currentGraph = graph

		const setup = async () => {
			destroyRenderer()

			const nextRenderer = await createRenderer(target, currentGraph)

			if (cancelled) {
				nextRenderer.kill()
				return
			}

			renderer = nextRenderer

			resizeObserver = new ResizeObserver(() => {
				renderer?.refresh()
			})

			resizeObserver.observe(target)
		}

		void setup()

		return () => {
			cancelled = true
			destroyRenderer()
		}
	})
</script>

<div class="sigma-graph">
	<div bind:this={container} class="sigma-container"></div>

	{#if error}
		<div class="overlay error">
			<p>Failed to load graph.</p>
			<p>{error}</p>
		</div>
	{:else if loading || !graph}
		<div class="overlay">
			<p>Preparing graph…</p>
		</div>
	{/if}
</div>

<style>
	.sigma-graph {
		position: relative;
		width: 100%;
		height: 100%;
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	.sigma-container {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.overlay {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		text-align: center;
		background: rgb(0 0 0 / 0.45);
		color: white;
		pointer-events: none;
	}

	.overlay.error {
		background: rgb(80 0 0 / 0.6);
	}
</style>