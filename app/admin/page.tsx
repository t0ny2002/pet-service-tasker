import { serverSupabase } from '@/lib/serverSupabase'
import { Count, Percentage } from '@/components/analytics'

export const dynamic = 'force-dynamic'

// Server side Admin Dashboard
export default async function AdminDashboard() {
	const supabase = serverSupabase()
	// Grabs all posts data
	const { data: posts } = await supabase
		.from('posts')
		.select('status, created_at')
	const { data: users } = await supabase.from('users').select('role')

	const lastMonth = new Date()
	lastMonth.setDate(lastMonth.getDate() - 30)
	const recentPosts = posts
		? posts.filter((post) => lastMonth < new Date(post.created_at))
		: null

	return (
		<main className='mx-auto flex w-full max-w-7xl flex-col gap-6 p-6 sm:p-10'>
			{/* Header */}
			<div className='md:flex md:items-center md:justify-between'>
				<div className='min-w-0 flex-1'>
					<h2 className='mb-2 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
						Admin Dashboard
					</h2>
				</div>
			</div>

			<div>
				<h3 className='text-base font-semibold leading-6 text-gray-900'>
					Last 30 days
				</h3>
				<dl className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3'>
					<Percentage
						title='Completion Rate'
						support='Complete and paid tasks'
						count={
							recentPosts &&
							recentPosts.filter(
								(post) => post.status === 'complete'
							).length / recentPosts.length
						}
					/>
					<Percentage
						title='Started Rate'
						support='Posts that are past open status'
						count={
							recentPosts &&
							recentPosts.filter((post) => post.status !== 'todo')
								.length / recentPosts.length
						}
					/>
					<Count
						title='Created Posts'
						count={recentPosts && recentPosts.length}
					/>
				</dl>
			</div>

			<div>
				<h3 className='text-base font-semibold leading-6 text-gray-900'>
					All time
				</h3>
				<dl className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3'>
					<Count title='Total Posts' count={posts && posts.length} />
					<Count
						title='Open Posts'
						count={
							posts &&
							posts.filter((post) => post.status === 'todo')
								.length
						}
						href='/admin/posts?status=todo'
					/>
					<Count
						title='Awaiting Payment'
						count={
							posts &&
							posts.filter((post) => post.status === 'paid')
								.length
						}
						href='/admin/actions'
					/>
				</dl>
			</div>

			<div>
				<h3 className='text-base font-semibold leading-6 text-gray-900'>
					Users
				</h3>
				<dl className='mt-3 grid grid-cols-1 gap-5 sm:grid-cols-3'>
					<Count
						title='Owners'
						count={
							users &&
							users.filter((user) => user.role === 'owner').length
						}
						href='/admin/users?role=Owners'
					/>
					<Count
						title='Carers'
						count={
							users &&
							users.filter((post) => post.role === 'carer').length
						}
						href='/admin/users?role=Carers'
					/>
					<Count
						title='Admins'
						count={
							users &&
							users.filter((post) => post.role === 'admin').length
						}
						href='/admin/users?role=Admins'
					/>
				</dl>
			</div>
		</main>
	)
}
