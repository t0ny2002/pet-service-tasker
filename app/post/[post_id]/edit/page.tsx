import { notFound } from 'next/navigation'
import { serverSupabase } from '@/lib/serverSupabase'
import Forbidden from '@/app/forbidden'
import { EditPost } from '@/components/post/EditPost'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({
	params,
}: {
	params: { post_id: number }
}) {
	const supabase = serverSupabase()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (user === null) {
		notFound()
	}

	const { data: userRow } = await supabase
		.from('users')
		.select('role')
		.eq('id', user.id)
		.single()
	if (userRow === null) {
		notFound()
	}

	const { data: post } = await supabase
		.from('posts')
		.select('*')
		.eq('id', params.post_id)
		.single()
	if (post === null) {
		notFound()
	}

	const isAdmin = userRow.role === 'admin'
	const isPostOwner = post.owner_id === user.id
	// Server side Edit Post Page
	if (isAdmin || (isPostOwner && post.status !== 'hidden')) {
		return (
			<main className='mx-auto w-full max-w-screen-md p-6 sm:p-10'>
				<EditPost post={post} />
			</main>
		)
	}
	return <Forbidden />
}
