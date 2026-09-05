<script lang="ts">
	import TransportButton from './TransportButton.svelte';

	type Props = {
		onBackward?: () => void;
		onForward?: () => void;
	};

	let { onBackward, onForward }: Props = $props();

	function handleKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;

		const target = event.target;
		if (
			target instanceof HTMLElement &&
			(target.isContentEditable ||
				target instanceof HTMLInputElement ||
				target instanceof HTMLTextAreaElement ||
				target instanceof HTMLSelectElement)
		) {
			return;
		}

		if (event.key === 'ArrowLeft') {
			event.preventDefault();
			onBackward?.();
		}

		if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
			event.preventDefault();
			onForward?.();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="container">
	<div class="transport-button-container previous">
		<TransportButton onclick={onBackward} label="Previous Slide" />
	</div>

	<div class="transport-button-container next">
		<TransportButton onclick={onForward} label="Next Slide" right />
	</div>
</div>

<style>
	.container {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: 2em 1fr 2em;
		grid-template-rows: 1fr;
		align-items: center;
		pointer-events: none;
	}

	.transport-button-container {
		width: 2em;
		height: 100%;
		pointer-events: all;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.previous {
		grid-column: 1;
		grid-row: 1;
	}

	.next {
		grid-column: 3;
		grid-row: 1;
	}
</style>