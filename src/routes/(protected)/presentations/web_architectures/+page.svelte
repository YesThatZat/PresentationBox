<script lang="ts">
	// Just loads the presentation. This pattern is deliberate and is so that presentation components aren't tied to the outer page structure. They can be re-used elsewhere etc. +page.svelte complicates this due to inheriting from layout

	import Presentation from './WebArchitectures.svelte';
</script>

<Presentation />
