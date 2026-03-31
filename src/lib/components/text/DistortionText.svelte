<!-- Experimental AF, uses weird text effects that 'exist' but nearly nothing uses them -->
<script lang="ts">
	import { onMount } from 'svelte'

	type Props = {
		text: string
		fontSize?: string
		fontWeight?: number | string
		scale?: number
		baseFrequencyX?: number
		baseFrequencyY?: number
		animate?: boolean
		speed?: number
		class?: string
	}

	let {
		text,
		fontSize = '4rem',
		fontWeight = 800,
		scale = 18,
		baseFrequencyX = 0.02,
		baseFrequencyY = 0.08,
		animate = true,
		speed = 1,
		class: className = ''
	}: Props = $props()

	const filterId = `wobble-${Math.random().toString(36).slice(2)}`

	let turbulenceEl: SVGFETurbulenceElement | undefined

	let time = 0
	let frameHandle = 0

	onMount(() => {
		if (!animate || !turbulenceEl) return

		const frame = () => {
			time += 0.015 * speed

			const x = baseFrequencyX + Math.sin(time) * 0.005
			const y = baseFrequencyY + Math.cos(time * 1.3) * 0.01

			turbulenceEl.setAttribute('baseFrequency', `${x} ${y}`)

			frameHandle = requestAnimationFrame(frame)
		}

		frameHandle = requestAnimationFrame(frame)

		return () => {
			cancelAnimationFrame(frameHandle)
		}
	})
</script>

<svg class="defs" aria-hidden="true" focusable="false">
	<filter id={filterId}>
		<feTurbulence
			bind:this={turbulenceEl}
			type="turbulence"
			baseFrequency={`${baseFrequencyX} ${baseFrequencyY}`}
			numOctaves="2"
			seed="2"
			result="noise"
		/>
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale={scale}
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
</svg>

<div
	class={`distorted ${className}`}
	style={`font-size:${fontSize}; font-weight:${fontWeight}; filter:url(#${filterId});`}
>
	{text}
</div>

<style>
	.defs {
		position: absolute;
		width: 0;
		height: 0;
		pointer-events: none;
	}

	.distorted {
		display: inline-block;
		color: white;
		line-height: 1;
		will-change: filter;
	}
</style>