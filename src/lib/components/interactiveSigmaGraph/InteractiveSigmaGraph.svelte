<script lang="ts">
	import { onMount } from 'svelte'

	import { InteractiveSigmaGraph } from './InteractiveSigmaGraph'
	import { LoadingGraphAnimation } from './LoadingGraphAnimation'

	let container: HTMLElement

	onMount(() => {
		const animation = new LoadingGraphAnimation()
		let renderer: InteractiveSigmaGraph | undefined
		let destroyed = false

		void InteractiveSigmaGraph
			.create(container, animation.graph)
			.then((createdRenderer) => {
				if (destroyed) {
					createdRenderer.destroy()
					return
				}

				renderer = createdRenderer
				void animation.play()
			})

		return () => {
			destroyed = true
			animation.stop()
			renderer?.destroy()
		}
	})
</script>

<div class="graph" bind:this={container}></div>

<style>
	.graph {
		width: 100%;
		height: 100%;
	}
</style>