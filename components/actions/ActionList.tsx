'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { ChevronRightIcon } from '@heroicons/react/20/solid'
import { Database } from '@/lib/types/supabase'
import { classNames } from '@/lib/helpers/simple'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { actionText } from '@/lib/helpers/actions'

type Action = Database['public']['Tables']['actions']['Row'] & {
	admin?: { id: string; firstName: string; lastName: string }
}

export function ActionList({ actions }: { actions: Action[] }) {
	const params = useSearchParams()
	const { getDetails } = useUserDetails()
	const { id } = getDetails()

	const [filtered, setFiltered] = useState<Action[]>(actions)

	// Filter actions based of url search params when they change
	useEffect(() => {
		if (!id) {
			return
		}

		const kindParam = params.get('kind')
		const assignedParam = params.get('assigned')

		let filteredActions = [...actions]

		if (kindParam && kindParam === 'REPORT') {
			filteredActions = filteredActions.filter((action) =>
				action.kind.startsWith('REPORT_')
			)
		} else if (kindParam && kindParam !== 'ALL') {
			filteredActions = filteredActions.filter(
				(action) => action.kind === kindParam
			)
		}
		if (assignedParam === 'ME') {
			filteredActions = filteredActions.filter(
				(action) => action.assigned_to === id
			)
		}

		setFiltered([...filteredActions])
	}, [params, id, actions])

	return (
		<ul
			role='list'
			data-hidden={!!params.get('selected')}
			className={classNames(
				'col-span-full md:col-span-6 lg:col-span-4 xl:col-span-3',
				'divide-y divide-gray-100 overflow-y-auto rounded-md border border-gray-900/5 bg-white shadow-sm',
				'flex flex-col data-[hidden=true]:hidden data-[hidden=true]:md:flex' // hidden when selected and on small screen
			)}
		>
			{filtered.map((action) => (
				<li
					key={action.id}
					className='relative flex justify-between gap-x-6 px-4 py-5 hover:bg-gray-50 sm:px-6'
				>
					<div className='flex min-w-0 gap-x-4'>
						<div className='min-w-0 flex-auto'>
							<p className='text-sm font-semibold leading-6 text-gray-900'>
								<Link
									href={`/admin/actions?kind=${
										params.get('kind') || 'ALL'
									}&assigned=${
										params.get('assigned') || 'ALL'
									}&selected=${action.id}`}
								>
									<span className='absolute inset-x-0 -top-px bottom-0' />
									{actionText(action.kind).title}
								</Link>
							</p>
							<p className='flex text-xs leading-5 text-gray-500'>
								{action.admin
									? `${action.admin.firstName} ${action.admin.lastName}`
									: 'Unassigned'}
							</p>
							<p className='flex text-xs leading-5 text-gray-500'>
								{action.created_at}
							</p>
						</div>
					</div>
					<div className='flex shrink-0 items-center gap-x-4'>
						<ChevronRightIcon
							className='h-5 w-5 flex-none text-gray-400'
							aria-hidden='true'
						/>
					</div>
				</li>
			))}

			{filtered.length === 0 && (
				<li className='relative flex items-center justify-center gap-x-6 px-4 py-5 text-gray-600 sm:px-6'>
					No actions found
				</li>
			)}
		</ul>
	)
}
