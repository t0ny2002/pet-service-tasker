import PostList from '@/components/posts/PostList'
import { getPosts } from '@/lib/helpers/posts'

export const dynamic = 'force-dynamic'

export default async function PostListPage() {
	const posts = await (
		await getPosts()
	).filter((post) => post.status === 'todo')

	return (
		<main className='mx-auto w-full max-w-7xl p-6 sm:p-10'>
			{/* Header */}
			<div className='flex justify-center'>
				<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
					Find Posts
				</h2>
			</div>

			<PostList posts={posts} />
		</main>
	)
}
