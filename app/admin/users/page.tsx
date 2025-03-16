import Link from 'next/link'
import { UserPlusIcon } from '@heroicons/react/24/solid'
import { createClient } from '@supabase/supabase-js'
import { UserRow, UsersTable } from '@/components/tables/UsersTable'

export default async function AdminUsers() {
	const supabase = createClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.SUPABASE_SERVICE_KEY!
	)

	let users: UserRow[] = []

	const { data: usersData } = await supabase
		.from('users')
		.select('id, firstName, lastName, role, image_url')
	if (usersData) {
		users = usersData.map((user) => ({
			id: user.id,
			name: `${user.firstName} ${user.lastName}`,
			role: user.role[0].toUpperCase() + user.role.slice(1),
			email: '',
			image_url: user.image_url,
		}))
	}

	// Get emails for each user
	const { data } = await supabase.auth.admin.listUsers({
		perPage: 1000,
	})
	if (data) {
		users = users.map((user) => ({
			...user,
			email: data.users.find((u) => u.id === user.id)?.email || '',
		}))
	}

	return (
		<main className='mx-auto w-full max-w-7xl p-6 sm:p-10'>
			{/* Header */}
			<div className='md:flex md:items-center md:justify-between'>
				<div className='min-w-0 flex-1'>
					<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
						Users
					</h2>
				</div>
				<div className='mt-4 flex md:ml-4 md:mt-0'>
					<Link
						href='/admin/invite'
						className='inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
					>
						<UserPlusIcon className='mr-2 h-5 w-5' />
						Invite Admin
					</Link>
				</div>
			</div>

			<UsersTable users={users} />
		</main>
	)
}
