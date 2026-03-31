<script lang="ts">
	import { onMount } from 'svelte'

	type Props = {
		text: string
		durationMs?: number
		staggerMs?: number
		arcHeightPx?: number
		rotationDegrees?: number
		fontSize?: string
		fontWeight?: number | string
		fontFamily?: string
		trackingPx?: number
		bouncePx?: number
		bounceRotateDeg?: number
		scalePop?: number
		offsetX?: string
		offsetY?: string
		textColor?: string
	}

	type CharacterLayout = {
		char: string
		x: number
		y: number
		rotateDeg: number
		delayMs: number
	}

	let {
		text,
		durationMs = 900,
		staggerMs = 35,
		arcHeightPx = 42,
		rotationDegrees = 8,
		fontSize = 'clamp(2rem, 5vw, 5rem)',
		fontWeight = 800,
		fontFamily = 'inherit',
		trackingPx = 0,
		bouncePx = 6,
		bounceRotateDeg = 1.5,
		scalePop = 1.015,
		offsetX = '0px',
		offsetY = '0px',
		textColor = 'currentColor'
	}: Props = $props()

	let host = $state<HTMLDivElement | undefined>(undefined)
	let measuredFontPx = $state(64)
	let layouts = $state<CharacterLayout[]>([])

	const characters = $derived([...text])

	function parsePixelFontSize(value: string) {
		const n = Number.parseFloat(value)
		return Number.isFinite(n) ? n : 64
	}

	function buildCanvasFont(fontPx: number) {
		return `${fontWeight} ${fontPx}px ${fontFamily}`
	}

	function measureWidths(chars: string[], fontPx: number) {
		const canvas = document.createElement('canvas')
		const ctx = canvas.getContext('2d')

		if (!ctx) {
			return chars.map(() => fontPx * 0.6)
		}

		ctx.font = buildCanvasFont(fontPx)

		return chars.map((char) => {
			const measureChar = char === ' ' ? '\u00A0' : char
			return ctx.measureText(measureChar).width
		})
	}

	function rebuildLayout() {
		if (!host) return

		const style = getComputedStyle(host)
		const computedFontPx = parsePixelFontSize(style.fontSize)
		measuredFontPx = computedFontPx

		const widths = measureWidths(characters, computedFontPx)

		if (widths.length === 0) {
			layouts = []
			return
		}

		let cursor = 0
		const centres = widths.map((width, index) => {
			const centre = cursor + width / 2
			cursor += width + trackingPx
			return { centre, width, index }
		})

		const totalWidth =
			widths.reduce((sum, width) => sum + width, 0) +
			Math.max(0, widths.length - 1) * trackingPx

		const halfWidth = totalWidth / 2

		layouts = centres.map(({ centre, index }) => {
			const x = centre - halfWidth
			const t = halfWidth === 0 ? 0 : x / halfWidth

			const y = -(1 - t * t) * arcHeightPx
			const rotateDeg = t * rotationDegrees

			return {
				char: characters[index] === ' ' ? '\u00A0' : characters[index],
				x,
				y,
				rotateDeg,
				delayMs: index * staggerMs
			}
		})
	}

	onMount(() => {
		rebuildLayout()

		const resizeObserver = new ResizeObserver(() => {
			rebuildLayout()
		})

		if (host) {
			resizeObserver.observe(host)
		}

		if ('fonts' in document) {
			document.fonts.ready.then(() => {
				rebuildLayout()
			})
		}

		return () => {
			resizeObserver.disconnect()
		}
	})
</script>

<div
	bind:this={host}
	class="title-fan"
	style:--fan-duration={`${durationMs}ms`}
	style:--fan-font-size={fontSize}
	style:--fan-font-weight={fontWeight}
	style:--fan-font-family={fontFamily}
	style:--fan-bounce={`${bouncePx}px`}
	style:--fan-bounce-rot={`${bounceRotateDeg}deg`}
	style:--fan-scale-pop={scalePop}
	style:--fan-offset-x={offsetX}
	style:--fan-offset-y={offsetY}
	style:--fan-text-color={textColor}
	aria-label={text}
>
	{#each layouts as item, index (index)}
		<span
			class="char"
			aria-hidden="true"
			style:--tx={`${item.x}px`}
			style:--ty={`${item.y}px`}
			style:--rot={`${item.rotateDeg}deg`}
			style:--delay={`${item.delayMs}ms`}
		>
			{item.char}
		</span>
	{/each}
</div>

<style>
	.title-fan {
		position: relative;
		display: block;
		inline-size: 100%;
		min-block-size: calc(var(--fan-font-size) * 2.4);
		overflow: visible;
		pointer-events: none;
		transform: translate(var(--fan-offset-x), var(--fan-offset-y));

		font-size: var(--fan-font-size);
		font-weight: var(--fan-font-weight);
		font-family: var(--fan-font-family);
		line-height: 1;
		color: var(--fan-text-color);
	}

	.char {
		position: absolute;
		left: 50%;
		top: 50%;
		display: inline-block;
		white-space: pre;
		line-height: 1;
		transform-origin: center center;
		opacity: 0;
		color: inherit;

		transform:
			translate(-50%, -50%)
			translate(0, 0)
			rotate(0deg)
			scale(0);

		animation: fan-out var(--fan-duration) linear var(--delay) forwards;
		will-change: transform, opacity;
	}

	@keyframes fan-out {
		0% {
			opacity: 0;
			transform:
				translate(-50%, -50%)
				translate(0, 0)
				rotate(0deg)
				scale(0);
			animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
		}

		72% {
			opacity: 1;
			transform:
				translate(-50%, -50%)
				translate(var(--tx), var(--ty))
				rotate(var(--rot))
				scale(1);
			animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		84% {
			opacity: 1;
			transform:
				translate(-50%, -50%)
				translate(var(--tx), calc(var(--ty) - var(--fan-bounce)))
				rotate(calc(var(--rot) + var(--fan-bounce-rot)))
				scale(var(--fan-scale-pop));
			animation-timing-function: cubic-bezier(0.2, 0.9, 0.3, 1);
		}

		100% {
			opacity: 1;
			transform:
				translate(-50%, -50%)
				translate(var(--tx), var(--ty))
				rotate(var(--rot))
				scale(1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.char {
			opacity: 1;
			animation: none;
			transform:
				translate(-50%, -50%)
				translate(var(--tx), var(--ty))
				rotate(var(--rot))
				scale(1);
		}
	}
</style>