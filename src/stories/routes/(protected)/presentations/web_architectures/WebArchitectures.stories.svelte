<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import Presentation from '../../../../../routes/(protected)/presentations/web_architectures/WebArchitectures.svelte'

	const { Story } = defineMeta({
		title: 'Presentations/Web_Architectures',
		component: Presentation,
		parameters: {
			layout: 'fullscreen'
		}
	})
</script>

<Story name="Run presentation">
	{#snippet template()}
		<div style="width: 100%; height: 100vh;">
			<Presentation />
		</div>
	{/snippet}
</Story>
