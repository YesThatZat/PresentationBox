<script module lang="ts">
	import { defineMeta } from '@storybook/addon-svelte-csf'
	import TestPresentation from '../../../../../routes/(protected)/presentations/test/TestPresentation.svelte'

	const { Story } = defineMeta({
		title: 'Presentations/Test',
		component: TestPresentation,
		parameters: {
			layout: 'fullscreen'
		}
	})
</script>

<Story name="Run presentation">
	{#snippet template()}
		<div style="width: 100%; height: 100vh;">
			<TestPresentation />
		</div>
	{/snippet}
</Story>