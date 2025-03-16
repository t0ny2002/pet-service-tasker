import { serverSupabase } from '@/lib/serverSupabase'
import { notFound } from 'next/navigation'
import { ActionFilters } from '@/components/actions/ActionFilters'
import { ActionList } from '@/components/actions/ActionList'
import { ActionDetails } from '@/components/actions/ActionDetails'
import { formatDateRelative } from '@/lib/helpers/dates'

export const dynamic = 'force-dynamic'

// Dynamic server side admin actions
export default async function AdminUsers() {
	// Grab all required actions as well as each user
	const supabase = serverSupabase()
	const { data: actionsData, error: actionError } = await supabase
		.from('actions')
		.select()
		.eq('status', 'todo')
		.order('created_at', { ascending: true })
	const { data: adminData, error: adminError } = await supabase
		.from('users')
		.select('id, firstName, lastName')
		.eq('role', 'admin')
	if (actionError || adminError) {
		notFound()
	}
	// Map the actions to include the admin assigned to it and format the date
	const actions = actionsData.map((action) => ({
		...action,
		created_at: formatDateRelative(action.created_at),
		admin: adminData.find((admin) => admin.id === action.assigned_to),
	}))

	return (
		<main className='mx-auto flex h-[calc(100%-64px)] w-full max-w-7xl flex-col p-6 sm:p-10'>
			{/* Header */}
			<div className='md:flex md:items-center md:justify-between'>
				<div className='min-w-0 flex-1'>
					<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
						Actions
					</h2>
				</div>
			</div>

			<ActionFilters />
			<div className='mt-6 grid flex-1 grid-cols-12 gap-6 overflow-y-hidden'>
				<ActionList actions={actions} />
				<ActionDetails admins={adminData} />
			</div>
		</main>
	)
}
