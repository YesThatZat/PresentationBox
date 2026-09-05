<!-- TransportButton.svelte -->
<script lang="ts">
	type Props = {
		right?: boolean;
		visible?: boolean;
		label?: string;
		onclick?: () => void;
	};

	let { right = false, visible = true, label, onclick }: Props = $props();

	let pressed = $state(false);
	let flying = $state(false);

	let ariaLabel = $derived(label ?? (right ? 'Advance slide' : 'Retreat slide'));

	function handlePointerDown() {
		if (!visible) return;
		pressed = true;
	}

	function handlePointerUp() {
		pressed = false;
	}

	function handleClick() {
		if (!visible) return;

		flying = false;
		requestAnimationFrame(() => {
			flying = true;
			onclick?.();
		});
	}

	function handleAnimationEnd(event: AnimationEvent) {
		if (event.animationName === 'fly-off-left') {
			flying = false;
		}
	}
</script>

<button
	type="button"
	class:visible
	class:pressed
	class:flying
	aria-label={ariaLabel}
	disabled={!visible}
	onpointerdown={handlePointerDown}
	onpointerup={handlePointerUp}
	onpointercancel={() => (pressed = false)}
	onclick={handleClick}
	onanimationend={handleAnimationEnd}
>
	<span class="icon-frame" class:right>
		<svg class="transport-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256">
			<polygon
				id="ArrowPoint"
				class="transport-fill arrow-point"
				points="143.93 256.35 15.59 128.01 143.6 0 159.51 15.92 47.42 128.01 159.84 240.43 143.93 256.35"
			/>
			<polygon
				id="ArrowShaft"
				class="transport-fill arrow-shaft"
				points="124.55 117.78 114.11 128.22 124.55 138.66 255.78 138.66 255.78 117.78 124.55 117.78"
			/>
		</svg>
	</span>
</button>

<style>
	button {
		width: 100%;
		height: 100%;
		padding: 0;
		border: 0;
		background: transparent;
		overflow: hidden;
		cursor: pointer;

		display: grid;
		place-items: center;

		opacity: 0;
		pointer-events: none;
		transform: translateX(-1.5rem);
		transition:
			opacity 180ms ease,
			transform 180ms ease;
	}

	button.visible {
		opacity: 1;
		pointer-events: auto;
		transform: translateX(0);
	}

	button:disabled {
		cursor: default;
	}

	button:hover {
		background-color: var(--color-transportcontrol-background);
	}

	.icon-frame {
		width: 100%;
		height: 100%;
		display: block;
	}

	.icon-frame.right {
		transform: rotate(180deg);
	}

	.transport-icon {
		width: 100%;
		height: 100%;
		display: block;
		overflow: visible;
	}

	.transport-fill {
		fill: var(--color-transportcontrol-foreground);
		transition:
			transform 120ms ease,
			opacity 120ms ease;
		transform-box: fill-box;
		transform-origin: center;
	}

	.arrow-point {
		transform: translateX(-1.25rem);
		opacity: 0;
	}

	.arrow-shaft {
		transform: translateX(-2rem);
		opacity: 0;
	}

	button.visible .arrow-point,
	button.visible .arrow-shaft {
		transform: translateX(0);
		opacity: 1;
	}

	button.pressed .arrow-shaft {
		transform: translateX(-0.75rem);
	}

	button.flying .transport-icon {
		animation: fly-off-left 420ms ease-in forwards;
	}

	@keyframes fly-off-left {
		0% {
			transform: translateX(0);
			opacity: 1;
		}

		65% {
			transform: translateX(-120%);
			opacity: 0;
		}

		66% {
			transform: translateX(120%);
			opacity: 0;
		}

		100% {
			transform: translateX(0);
			opacity: 1;
		}
	}
</style>