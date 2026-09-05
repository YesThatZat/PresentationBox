<script lang="ts">
	type Props = {
		imgSrc: string
		alt?: string
		durationMs?: number
	}

	let { imgSrc, alt = '', durationMs = 8000 }: Props = $props()
</script>

<div class="image-layer">
	<img
		src={imgSrc}
		alt={alt}
		style={`--image-pan-duration: ${durationMs}ms;`}
	/>
</div>

<style>
	.image-layer {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.image-layer img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		animation:
			imagePan var(--image-pan-duration, 8000ms) ease-out forwards,
			imageGrade var(--image-pan-duration, 8000ms) ease-out forwards;
		will-change: transform, filter;
	}

	@keyframes imagePan {
		from {
			transform: translateY(5%) scale(1.1);
		}
		to {
			transform: translateY(0) scale(1);
		}
	}

	@keyframes imageGrade {
		0% {
			filter: brightness(3) saturate(0.1);
		}
		40% {
			filter: brightness(1) saturate(1);
		}
		100% {
			filter: brightness(1) saturate(1);
		}
	}
</style>