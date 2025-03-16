import { notFound } from 'next/navigation'
import { PostsTable } from '@/components/tables/posts/PostsTable'
import { serverSupabase } from '@/lib/serverSupabase'
import { formatSimpleDate } from '@/lib/helpers/dates'
import { capitalise } from '@/lib/helpers/simple'

export const dynamic = 'force-dynamic'

// Server side Posts Page
export default async function PostListPage() {
	const supabase = serverSupabase()

	const { data, error } = await supabase
		.from('posts')
		.select('*, users!posts_owner_id_fkey (firstName, lastName)')
		.order('start_time', { ascending: false })
	if (error) {
		console.log(error)
		notFound()
	}

	// Format posts data
	const posts = data.map((post) => ({
		id: post.id,
		title: post.title,
		status: post.status,
		location: capitalise(post.location),
		category: capitalise(post.category),
		startTime: post.start_time
			? formatSimpleDate(post.start_time)
			: 'Unknown',
		ownerId: post.owner_id,
		ownerName: post.users
			? post.users.firstName + ' ' + post.users.lastName
			: 'Unknown',
	}))

	return (
		<main className='mx-auto w-full max-w-7xl p-6 sm:p-10'>
			{/* Header */}
			<div className='md:flex md:items-center md:justify-between'>
				<div className='min-w-0 flex-1'>
					<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
						Posts
					</h2>
				</div>
			</div>

			<PostsTable posts={posts} />
		</main>
	)
}
