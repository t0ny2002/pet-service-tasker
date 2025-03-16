import ViewPost from '@/components/post/ViewPost'

export default function ViewPostPage({
	params,
}: {
	params: { post_id: number }
}) {
	return (
		<main className='w-full max-w-screen-md mx-auto p-6 sm:p-10'>
			<ViewPost post_id={params.post_id} />
		</main>
	)
}
