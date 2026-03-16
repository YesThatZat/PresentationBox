<script lang="ts">
    type props = {
        isActive:boolean
        title:string
    }
	let { isActive = false, title = "Set a title in the parent" }: props = $props();
</script>

<h1
	class="title"
>
	{title}
</h1>
<h2>Is Active?: {isActive}</h2>

<style>
	.title {
		font-size: xx-large;
	}
</style>