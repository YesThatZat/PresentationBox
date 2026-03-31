<script lang="ts">
	import { onDestroy } from 'svelte'

	type Props = {
		active?: boolean
		delayMs?: number
		children: import('svelte').Snippet
	}

	let { active = false, delayMs = 0, children }: Props = $props()

	let visible = $state(false)
	let timer: ReturnType<typeof setTimeout> | null = null

	function clearTimer() {
		if (timer) {
			clearTimeout(timer)
			timer = null
		}
	}

	$effect(() => {
		clearTimer()

		if (!active) {
			visible = false
			return
		}

		if (delayMs <= 0) {
			visible = true
			return
		}

		visible = false
		timer = setTimeout(() => {
			visible = true
			timer = null
		}, delayMs)

		return () => {
			clearTimer()
		}
	})

	onDestroy(() => {
		clearTimer()
	})
</script>

{#if visible}
	{@render children()}
{/if}