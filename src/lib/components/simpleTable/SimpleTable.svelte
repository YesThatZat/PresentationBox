<script lang="ts">
	import { SimpleTable as SimpleTableGrid } from '@simple-table/svelte'
	import type { Theme } from '@simple-table/svelte'
	import {
		exampleSimpleTableData,
		type ExampleSimpleTableData
	} from './ExampleTransformer'
	import '@simple-table/svelte/styles.css'

	type Props = {
		data?: ExampleSimpleTableData
		height?: string | number
		theme?: Theme
		isLoading?: boolean
	}

	let {
		data = exampleSimpleTableData,
		height = '420px',
		theme = 'modern-light',
		isLoading = false
	}: Props = $props()
</script>

<div class="simple-table-shell">
	<div class="table-context">
		<div>
			<h2>{data.source.portfolioName}</h2>
			<p>Portfolio ID: {data.source.portfolioId}</p>
		</div>

		<p>Retrieved: {new Date(data.source.retrievedAt).toLocaleString('en-GB')}</p>
	</div>

	<SimpleTableGrid
		defaultHeaders={data.headers}
		rows={data.rows}
		{height}
		{theme}
		{isLoading}
		columnReordering={true}
		columnResizing={true}
		editColumns={true}
		selectableCells={true}
		useHoverRowBackground={true}
		useOddEvenRowBackground={true}
		autoExpandColumns={false}
	/>
</div>

<style>
	.simple-table-shell {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		width: min(1400px, 100%);
		min-width: 0;
		overflow: hidden;
	}

	.table-context {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		gap: 1rem;
		min-width: 0;
	}

	.table-context h2 {
		margin: 0;
		font-size: 1rem;
	}

	.table-context p {
		margin: 0;
		color: #64748b;
		font-size: 0.875rem;
	}
</style>