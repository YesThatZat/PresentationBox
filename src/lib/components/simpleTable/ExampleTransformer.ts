import type { SvelteHeaderObject } from '@simple-table/svelte'

type ApiHealth = 'green' | 'amber' | 'red'

export type ExampleApiResponse = {
	retrievedAt: string
	portfolio: {
		id: string
		name: string
		owner: string
	}
	workstreams: Array<{
		workstreamId: string
		name: string
		sponsor: {
			displayName: string
			directorate: string
		}
		delivery: {
			health: ApiHealth
			progress: {
				completedWorkItems: number
				totalWorkItems: number
				monthlyCompletionPercent: number[]
			}
			risk: {
				openRisks: number
			}
			finance: {
				spendToDatePence: number
				monthlyBurnPence: number[]
			}
			nextMilestone: {
				title: string
				dueDate: string
			}
		}
	}>
}

export type ExampleSimpleTableRow = {
	id: string
	workstream: string
	directorate: string
	sponsor: string
	status: 'Green' | 'Amber' | 'Red'
	completionPercent: number
	completionTrend: number[]
	openRisks: number
	budgetSpentGbp: number
	monthlyBurnGbp: number[]
	nextMilestone: string
	milestoneDue: string
}

export type ExampleSimpleTableData = {
	headers: SvelteHeaderObject[]
	rows: ExampleSimpleTableRow[]
	source: {
		portfolioId: string
		portfolioName: string
		retrievedAt: string
	}
}

const gbpFormatter = new Intl.NumberFormat('en-GB', {
	style: 'currency',
	currency: 'GBP',
	maximumFractionDigits: 0
})

function asStatusLabel(value: ApiHealth): ExampleSimpleTableRow['status'] {
	switch (value) {
		case 'green':
			return 'Green'
		case 'amber':
			return 'Amber'
		case 'red':
			return 'Red'
	}
}

function percentComplete(completed: number, total: number): number {
	if (total <= 0) {
		return 0
	}

	return Math.round((completed / total) * 1000) / 10
}

function penceToPounds(value: number): number {
	return Math.round(value / 100)
}

function formatPercent(value: unknown): string {
	const numberValue = typeof value === 'number' ? value : Number(value)

	if (!Number.isFinite(numberValue)) {
		return ''
	}

	return `${numberValue.toFixed(1)}%`
}

function formatGbp(value: unknown): string {
	const numberValue = typeof value === 'number' ? value : Number(value)

	if (!Number.isFinite(numberValue)) {
		return ''
	}

	return gbpFormatter.format(numberValue)
}

export function transformExampleApiResponseToSimpleTable(
	apiResponse: ExampleApiResponse
): ExampleSimpleTableData {
	const headers: SvelteHeaderObject[] = [
		{
			accessor: 'workstream',
			label: 'Workstream',
			type: 'string',
			pinned: 'left',
			width: '1.4fr',
			minWidth: 180,
			isSortable: true,
			filterable: true,
			isEssential: true
		},
		{
			accessor: 'directorate',
			label: 'Directorate',
			type: 'string',
			width: 160,
			isSortable: true,
			filterable: true
		},
		{
			accessor: 'sponsor',
			label: 'Sponsor',
			type: 'string',
			width: 160,
			isSortable: true,
			filterable: true
		},
		{
			accessor: 'delivery',
			label: 'Delivery',
			children: [
				{
					accessor: 'status',
					label: 'Status',
					type: 'enum',
					width: 120,
					isSortable: true,
					filterable: true,
					enumOptions: [
						{ label: 'Green', value: 'Green' },
						{ label: 'Amber', value: 'Amber' },
						{ label: 'Red', value: 'Red' }
					]
				},
				{
					accessor: 'completionPercent',
					label: 'Complete',
					type: 'number',
					width: 120,
					align: 'right',
					isSortable: true,
					valueFormatter: ({ value }) => formatPercent(value)
				},
				{
					accessor: 'completionTrend',
					label: 'Trend',
					type: 'lineAreaChart',
					width: 150,
					chartOptions: {
						min: 0,
						max: 100,
						height: 28
					}
				}
			]
		},
		{
			accessor: 'riskAndFinance',
			label: 'Risk / Finance',
			children: [
				{
					accessor: 'openRisks',
					label: 'Open Risks',
					type: 'number',
					width: 120,
					align: 'right',
					isSortable: true
				},
				{
					accessor: 'budgetSpentGbp',
					label: 'Spend',
					type: 'number',
					width: 130,
					align: 'right',
					isSortable: true,
					valueFormatter: ({ value }) => formatGbp(value)
				},
				{
					accessor: 'monthlyBurnGbp',
					label: 'Monthly Burn',
					type: 'barChart',
					width: 150,
					chartOptions: {
						height: 28
					}
				}
			]
		},
		{
			accessor: 'milestone',
			label: 'Next Milestone',
			children: [
				{
					accessor: 'nextMilestone',
					label: 'Milestone',
					type: 'string',
					width: '1fr',
					minWidth: 180,
					filterable: true
				},
				{
					accessor: 'milestoneDue',
					label: 'Due',
					type: 'date',
					width: 120,
					isSortable: true
				}
			]
		}
	]

	const rows: ExampleSimpleTableRow[] = apiResponse.workstreams.map((workstream) => ({
		id: workstream.workstreamId,
		workstream: workstream.name,
		directorate: workstream.sponsor.directorate,
		sponsor: workstream.sponsor.displayName,
		status: asStatusLabel(workstream.delivery.health),
		completionPercent: percentComplete(
			workstream.delivery.progress.completedWorkItems,
			workstream.delivery.progress.totalWorkItems
		),
		completionTrend: workstream.delivery.progress.monthlyCompletionPercent,
		openRisks: workstream.delivery.risk.openRisks,
		budgetSpentGbp: penceToPounds(workstream.delivery.finance.spendToDatePence),
		monthlyBurnGbp: workstream.delivery.finance.monthlyBurnPence.map(penceToPounds),
		nextMilestone: workstream.delivery.nextMilestone.title,
		milestoneDue: workstream.delivery.nextMilestone.dueDate.slice(0, 10)
	}))

	return {
		headers,
		rows,
		source: {
			portfolioId: apiResponse.portfolio.id,
			portfolioName: apiResponse.portfolio.name,
			retrievedAt: apiResponse.retrievedAt
		}
	}
}

export const exampleApiResponse: ExampleApiResponse = {
	retrievedAt: '2026-07-05T12:30:00.000Z',
	portfolio: {
		id: 'pf-alpha',
		name: 'Operational Modernisation Portfolio',
		owner: 'Delivery Office'
	},
	workstreams: [
		{
			workstreamId: 'ws-001',
			name: 'Identity Platform Upgrade',
			sponsor: {
				displayName: 'Amelia Hart',
				directorate: 'Digital Services'
			},
			delivery: {
				health: 'green',
				progress: {
					completedWorkItems: 86,
					totalWorkItems: 120,
					monthlyCompletionPercent: [41, 48, 53, 61, 67, 72]
				},
				risk: {
					openRisks: 3
				},
				finance: {
					spendToDatePence: 48500000,
					monthlyBurnPence: [4200000, 5100000, 5300000, 6100000, 5800000, 6700000]
				},
				nextMilestone: {
					title: 'Production readiness review',
					dueDate: '2026-08-14T00:00:00.000Z'
				}
			}
		},
		{
			workstreamId: 'ws-002',
			name: 'Casework API Consolidation',
			sponsor: {
				displayName: 'Marcus Chen',
				directorate: 'Integration'
			},
			delivery: {
				health: 'amber',
				progress: {
					completedWorkItems: 54,
					totalWorkItems: 110,
					monthlyCompletionPercent: [18, 24, 31, 38, 44, 49]
				},
				risk: {
					openRisks: 7
				},
				finance: {
					spendToDatePence: 73250000,
					monthlyBurnPence: [8700000, 9200000, 9800000, 10100000, 10800000, 11200000]
				},
				nextMilestone: {
					title: 'Consumer migration checkpoint',
					dueDate: '2026-09-03T00:00:00.000Z'
				}
			}
		},
		{
			workstreamId: 'ws-003',
			name: 'Reporting Data Mart',
			sponsor: {
				displayName: 'Priya Sharma',
				directorate: 'Data & Analytics'
			},
			delivery: {
				health: 'red',
				progress: {
					completedWorkItems: 21,
					totalWorkItems: 90,
					monthlyCompletionPercent: [9, 11, 14, 17, 19, 23]
				},
				risk: {
					openRisks: 11
				},
				finance: {
					spendToDatePence: 39300000,
					monthlyBurnPence: [3300000, 4100000, 6200000, 7900000, 8400000, 8600000]
				},
				nextMilestone: {
					title: 'Data quality recovery plan',
					dueDate: '2026-07-28T00:00:00.000Z'
				}
			}
		},
		{
			workstreamId: 'ws-004',
			name: 'Self-Service Admin Portal',
			sponsor: {
				displayName: 'Noah Williams',
				directorate: 'Operations'
			},
			delivery: {
				health: 'green',
				progress: {
					completedWorkItems: 98,
					totalWorkItems: 130,
					monthlyCompletionPercent: [46, 52, 60, 66, 71, 75]
				},
				risk: {
					openRisks: 2
				},
				finance: {
					spendToDatePence: 52100000,
					monthlyBurnPence: [4900000, 5200000, 5600000, 5400000, 5900000, 6100000]
				},
				nextMilestone: {
					title: 'Limited private beta',
					dueDate: '2026-08-21T00:00:00.000Z'
				}
			}
		}
	]
}

export const exampleSimpleTableData =
	transformExampleApiResponseToSimpleTable(exampleApiResponse)