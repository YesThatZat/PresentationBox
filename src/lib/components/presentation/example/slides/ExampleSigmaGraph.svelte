<script lang="ts">
	import { onMount } from 'svelte'
	import { browser } from '$app/environment'

	type Props = {
		dataUrl?: string
		active?: boolean
	}

	let {
		dataUrl = 'https://raw.githubusercontent.com/jacomyal/sigma.js/refs/heads/main/packages/storybook/stories/_data/data.json',
		active = true
	}: Props = $props()

	let container = $state<HTMLDivElement | null>(null)
	let loading = $state(true)
	let error = $state<string | null>(null)
	let stats = $state<{ nodes: number; edges: number } | null>(null)

	let renderer: any = null
	let resizeObserver: ResizeObserver | null = null
	let graphLoaded = false

	async function initSigma() {
		if (!browser || !container || graphLoaded) {
			return
		}

		loading = true
		error = null

		try {
			const [{ default: Graph }, { default: Sigma }] = await Promise.all([
				import('graphology'),
				import('sigma')
			])

			const response = await fetch(dataUrl)

			if (!response.ok) {
				throw new Error(`Failed to fetch graph data: ${response.status} ${response.statusText}`)
			}

			const data = await response.json()

			const graph = new Graph()
			graph.import(data)

			stats = {
				nodes: graph.order,
				edges: graph.size
			}

			if (!container) {
				throw new Error('Sigma container was not available')
			}

			renderer = new Sigma(graph, container, {
				renderEdgeLabels: false,
				enableEdgeEvents: true,
				allowInvalidContainer: false,
				defaultNodeType: 'circle',
				defaultEdgeType: 'line',
				labelRenderedSizeThreshold: 14,
				minCameraRatio: 0.08,
				maxCameraRatio: 4
			})

			// Slightly nicer initial framing
			const camera = renderer.getCamera()
			camera.setState({ ratio: 1.2 })

			resizeObserver = new ResizeObserver(() => {
				renderer?.refresh()
			})

			resizeObserver.observe(container)

			graphLoaded = true
		} catch (e) {
			error = e instanceof Error ? e.message : String(e)
		} finally {
			loading = false
		}
	}

	onMount(() => {
		void initSigma()

		return () => {
			resizeObserver?.disconnect()
			resizeObserver = null

			if (renderer) {
				renderer.kill()
				renderer = null
			}
		}
	})
</script>

<div class="sigma-shell" data-active={active}>
	{#if loading}
		<div class="status">Loading graph…</div>
	{:else if error}
		<div class="status error">
			<p>Failed to load graph.</p>
			<pre>{error}</pre>
		</div>
	{:else}
		<div class="meta">
			{#if stats}
				<span>{stats.nodes} nodes</span>
				<span>{stats.edges} edges</span>
			{/if}
		</div>
	{/if}

	<div bind:this={container} class="sigma-container"></div>
</div>

<style>
	.sigma-shell {
		position: relative;
		width: 100%;
		height: 100%;
		min-height: 24rem;
		background: #0f172a;
		border-radius: 1rem;
		overflow: hidden;
	}

	.sigma-container {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.meta {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 2;
		display: flex;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		border-radius: 999px;
		background: rgb(255 255 255 / 0.9);
		color: #111827;
		font-size: 0.875rem;
	}

	.status {
		position: absolute;
		inset: 0;
		z-index: 2;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		color: white;
		background: rgb(15 23 42 / 0.65);
		text-align: center;
	}

	.status.error {
		align-items: flex-start;
		justify-content: flex-start;
		text-align: left;
	}

	.status pre {
		white-space: pre-wrap;
		word-break: break-word;
		font-size: 0.875rem;
	}
</style>