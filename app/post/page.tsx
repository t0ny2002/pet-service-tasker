import { CreatePostForm } from '@/components/post/CreatePostForm'
import { serverSupabase } from '@/lib/serverSupabase'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Page() {
	const supabase = serverSupabase()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	if (user === null) {
		redirect('/posts')
	}

	const { data } = await supabase
		.from('users')
		.select('id')
		.eq('id', user.id)
		.eq('role', 'owner')
		.single()
	if (data === null) {
		notFound()
	}

	return (
		<main className='mx-auto w-full max-w-screen-md p-6 sm:p-10'>
			<CreatePostForm uid={user.id} />
		</main>
	)
}
