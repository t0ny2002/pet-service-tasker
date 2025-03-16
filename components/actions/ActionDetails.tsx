'use client'

import { supabase } from '@/lib/clientSupabase'
import { actionText } from '@/lib/helpers/actions'
import { classNames } from '@/lib/helpers/simple'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Database } from '@/lib/types/supabase'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ConfirmPayDetails } from './details/ConfirmPayDetails'
import { ConfirmReportDetails } from './details/ConfirmReportDetails'

type Admin = {
	id: string
	firstName: string
	lastName: string
}
type Action = Database['public']['Tables']['actions']['Row']

export function ActionDetails({ admins }: { admins: Admin[] }) {
	const router = useRouter()
	const params = useSearchParams()
	const { getDetails } = useUserDetails()
	const { id: uid } = getDetails()

	const [action, setAction] = useState<Action | null>(null)
	const [assigned, setAssigned] = useState<Admin>({
		id: 'null',
		firstName: '',
		lastName: '',
	})

	// Unselect action via params
	const clearSelection = useCallback(() => {
		const kind = params.get('kind')
		const assigned = params.get('assigned')
		router.replace(
			`/admin/actions?kind=${kind || 'ALL'}&assigned=${assigned || 'ALL'}`
		)
	}, [params, router])

	// When selected action gets changed via params, try to fetch it
	useEffect(() => {
		// Try to fetch selected action
		const fetchAction = async (id: number) => {
			const { data: actionData, error } = await supabase
				.from('actions')
				.select()
				.eq('id', id)
				.single()
			if (error) {
				// Unselect if not found
				clearSelection()
				return
			}
			setAction(actionData)
			// Set the assigned admin on the action
			if (admins && actionData.assigned_to) {
				const assignedAdmin = admins.find(
					(admin) => admin.id === actionData.assigned_to
				)
				if (assignedAdmin) {
					setAssigned({
						id: actionData.assigned_to,
						firstName: assignedAdmin.firstName,
						lastName: assignedAdmin.lastName,
					})
					return
				}
			}
			setAssigned({
				id: 'null',
				firstName: '',
				lastName: '',
			})
		}

		const selected = params.get('selected')
		if (!selected) {
			setAction(null)
			return
		}

		try {
			const actionId = Number.parseInt(selected)
			fetchAction(actionId)
		} catch {
			clearSelection()
		}
	}, [params, clearSelection, admins])

	const assignTo = async (id: string | null) => {
		if (!id || assigned.id === id) {
			return
		}
		const selected = params.get('selected')
		if (!selected) {
			return
		}
		const actionId = Number.parseInt(selected)
		await supabase
			.from('actions')
			.update({ assigned_to: id === 'null' ? null : id })
			.eq('id', actionId)
		router.refresh()
	}

	function getActionDetailBlock(action: Action) {
		if (action.kind === 'CONFIRM_PAY' && action.ref && uid) {
			return (
				<ConfirmPayDetails
					admin_id={uid}
					post_id={parseInt(action.ref)}
					action={action}
				/>
			)
		} else if (action.kind.startsWith('REPORT_') && action.ref && uid) {
			return <ConfirmReportDetails admin_id={uid} action={action} />
		}
		// Invalid type
		return null
	}

	return (
		<section
			data-hidden={!action} // If nothing selected and mobile, be hidden
			className={classNames(
				'col-span-full rounded-md border border-gray-900/5 bg-white shadow-sm md:col-span-6 lg:col-span-8 xl:col-span-9',
				'flex flex-col data-[hidden=true]:hidden data-[hidden=true]:md:flex',
				'overflow-y-auto px-4 py-5 sm:px-6'
			)}
		>
			{action ? (
				<div className='divide-y divide-gray-900/5'>
					<div className='flex flex-col gap-2 pb-5 md:gap-4 lg:flex-row'>
						<div className='flex items-center gap-4 lg:flex-1 lg:items-start'>
							<button
								type='button'
								className='rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 md:hidden'
								onClick={() => clearSelection()}
							>
								<span className='sr-only'>Close</span>
								<ChevronLeftIcon
									className='h-6 w-6'
									aria-hidden='true'
								/>
							</button>
							<div>
								<h3 className='text-lg'>
									{actionText(action.kind).title}
								</h3>
								<p className='hidden text-sm text-gray-500 md:block'>
									{assigned.id !== 'null'
										? `Assigned: ${assigned.firstName} ${assigned.lastName}`
										: 'Unassigned'}
								</p>
							</div>
						</div>

						{/* Assigned admin logic */}
						<div className='flex flex-col items-start gap-2 lg:items-end'>
							<p className='text-gray-500 md:hidden'>
								{assigned.id !== 'null'
									? `Assigned: ${assigned.firstName} ${assigned.lastName}`
									: 'Unassigned'}
							</p>
							<button
								type='button'
								className='rounded bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
								onClick={() => assignTo(uid)}
							>
								Assign to me
							</button>
							<div>
								<select
									id='assigned'
									name='assigned'
									className='block w-full rounded-md border-0 py-0.5 pl-2 pr-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600'
									value={assigned.id}
									onChange={(e) => assignTo(e.target.value)}
								>
									<option value='null'>Unassigned</option>
									{admins.map((admin) => (
										<option
											key={admin.id}
											value={admin.id}
										>{`${admin.firstName} ${admin.lastName}`}</option>
									))}
								</select>
							</div>
						</div>
					</div>

					{/* Action main content */}
					<div className='divide-y divide-gray-700/50 pt-5 text-gray-900'>
						<p className='pb-4 text-gray-600'>
							{actionText(action.kind).description}
						</p>
						<div>{getActionDetailBlock(action)}</div>
					</div>
				</div>
			) : (
				<div className='flex h-full w-full items-center justify-center text-gray-600'>
					No action selected
				</div>
			)}
		</section>
	)
}
