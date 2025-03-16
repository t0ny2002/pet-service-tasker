export type DashboardTab = {
	name: string
	value: string
	accept: string[]
}

export const carerDashboardTabs: DashboardTab[] = [
	{ name: 'Bid Made', value: 'open', accept: ['todo'] },
	{ name: 'Assigned', value: 'progress', accept: ['progress'] },
	{ name: 'Awaiting Payment', value: 'payment', accept: ['done'] },
	{ name: 'Complete', value: 'complete', accept: ['paid', 'complete'] },
]

export const ownerDashboardTabs: DashboardTab[] = [
	{ name: 'Open', value: 'open', accept: ['todo'] },
	{ name: 'In Progress', value: 'progress', accept: ['progress'] },
	{ name: 'Payment Required', value: 'payment', accept: ['done'] },
	{ name: 'Complete', value: 'complete', accept: ['paid', 'complete'] },
]
