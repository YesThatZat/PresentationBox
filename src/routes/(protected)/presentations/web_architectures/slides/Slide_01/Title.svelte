<script lang="ts">
	import BackgroundImage from "$lib/components/text/BackgroundImage.svelte";
	import DelayedReveal from "$lib/components/text/DelayedReveal.svelte";
	import TitleFan from "$lib/components/text/TitleFan.svelte";

    type props = {
        isActive:boolean
        title:string
    }
	let { isActive = false, title = "Set a title in the parent" }: props = $props();
</script>

<BackgroundImage imgSrc="/StarryNight.jpg" />
<DelayedReveal active={isActive} delayMs={4000}>
<div class="title-container">
		<TitleFan
			text={title}
			fontSize="clamp(1.5rem, 5vw, 4rem)"
			fontWeight={600}
			textColor="#ffffff"
			arcHeightPx={40}
			rotationDegrees={10}
			trackingPx={50}
			durationMs={950}
			staggerMs={28}
			bouncePx={5}
			bounceRotateDeg={1.2}
			scalePop={1.012}
			offsetX="-25vw"
			offsetY="-15vh"
		/>
</div>
</DelayedReveal>

<style>
	.title-container {
		position: absolute;
		bottom:0%;
		left: 0%;
		width: 100%;
		display: flex;
		align-items: flex-start;
	}
</style>