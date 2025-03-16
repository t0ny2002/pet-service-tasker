import { redirect } from 'next/navigation'
import { serverSupabase } from '@/lib/serverSupabase'
import { getPosts } from '@/lib/helpers/posts'
import { carerDashboardTabs, ownerDashboardTabs } from '@/lib/helpers/dashboard'
import { DashboardPosts } from '@/components/dashboard/DashboardPosts'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
	const supabase = serverSupabase()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (!user) {
		redirect('/')
	}
	const { data, error } = await supabase
		.from('users')
		.select('role')
		.eq('id', user.id)
		.single()
	if (error) {
		redirect('/')
	}
	// Redirect if admin
	if (data.role === 'admin') {
		redirect('/admin')
	}

	// Filter tabs based on role
	const tabs = data.role === 'owner' ? ownerDashboardTabs : carerDashboardTabs

	// Filter posts based on role
	let posts = await getPosts()
	if (data.role === 'owner') {
		posts = posts.filter((post) => post.owner.id === user.id)
	} else {
		posts = posts.filter((post) => {
			if (post.status === 'todo') {
				const bidMade = post.bids.find((bid) => bid.uid === user.id)
				return bidMade
			}
			return post.carer?.id === user.id
		})
	}

	return (
		<main className='mx-auto w-full max-w-7xl p-6 sm:p-10'>
			{/* Header */}
			<div className='flex justify-center'>
				<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
					Dashboard
				</h2>
			</div>

			<DashboardPosts tabs={tabs} posts={posts} />
		</main>
	)
}
