'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ActionKind } from '@/lib/types/global'

export function ActionFilters() {
	const router = useRouter()
	const params = useSearchParams()

	const [kind, setKind] = useState<ActionKind | 'ALL'>('ALL')
	const [assigned, setAssigned] = useState<'ME' | 'ALL'>('ALL')

	// When search params change, update the states
	useEffect(() => {
		const kindParam = params.get('kind')
		const assignedParam = params.get('assigned')

		if (kindParam === 'CONFIRM_PAY' || kindParam === 'REPORT') {
			setKind(kindParam)
		} else setKind('ALL')

		if (assignedParam === 'ME') {
			setAssigned(assignedParam)
		} else setAssigned('ALL')
	}, [params])

	// Update and control the search params
	const updateFilters = (type: 'kind' | 'assigned', value: string) => {
		let kindParam = params.get('kind') || 'ALL'
		let assignedParam = params.get('assigned') || 'ALL'
		const selected = params.get('selected')

		if (type === 'kind') kindParam = value
		else assignedParam = value

		if (selected) {
			router.replace(
				`/admin/actions?kind=${kindParam}&assigned=${assignedParam}&selected=${selected}`
			)
		} else {
			router.replace(
				`/admin/actions?kind=${kindParam}&assigned=${assignedParam}`
			)
		}
	}

	return (
		<div
			data-hidden={!!params.get('selected')}
			className='mt-6 flex flex-col gap-3 data-[hidden=true]:hidden md:flex-row data-[hidden=true]:md:flex'
		>
			{/* Select Kind Filter */}
			<div>
				<label
					htmlFor='actionkind'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Type
				</label>
				<select
					id='actionkind'
					name='actionkind'
					className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
					value={kind}
					onChange={(e) => updateFilters('kind', e.target.value)}
				>
					<option value='ALL'>All</option>
					<option value='CONFIRM_PAY'>Confirm Payment</option>
					<option value='REPORT'>Reports</option>
				</select>
			</div>

			{/* Select Admin Filter */}
			<div>
				<label
					htmlFor='assigned'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Assigned Admin
				</label>
				<select
					id='assigned'
					name='assigned'
					className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
					value={assigned}
					onChange={(e) => updateFilters('assigned', e.target.value)}
				>
					<option value='ALL'>All</option>
					<option value='ME'>Assigned to me</option>
				</select>
			</div>
		</div>
	)
}
