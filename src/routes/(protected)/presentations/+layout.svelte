<script lang="ts">
	let { children } = $props();
</script>

<div class="stage">
	{@render children()}
</div>

<style>
	.stage {
		position: absolute;
		top: 0;
		left: 0;
		background: var(--background);
		height: 100vh;
		width: 100vw;
		overflow: hidden;
	}
</style>
