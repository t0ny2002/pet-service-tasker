import { formatDateString } from '@/lib/helpers/dates'
import { notFound } from 'next/navigation'

import { JobOverview } from './JobOverview'
import BidSection from './Bids/BidsSection'
import PostProgress from './PostProgress/PostProgress'
import { serverSupabase } from '@/lib/serverSupabase'
import { getUserDetails } from '@/lib/helpers/userServer'
import QuestionSection from './Questions/QuestionSection'
import { PostTabs } from './PostTabs'
import { EditPostAlert } from './EditPostAlert'

export const dynamic = 'force-dynamic'

export default async function ViewPost({ post_id }: { post_id: number }) {
	const supabase = serverSupabase()
	const userDetails = await getUserDetails()
	const { id, role } = userDetails || { id: '', role: '' }

	// Get this post
	const { data: postData, error: postError } = await supabase
		.from('posts')
		.select('*')
		.eq('id', post_id)
		.single()
	if (postError) {
		notFound()
	}
	const post = {
		...postData,
		start_time: postData.start_time
			? formatDateString(postData.start_time)
			: 'Unknown Start Time',
	}

	// Get the owner of the post
	const { data: owner, error: ownerError } = await supabase
		.from('users')
		.select('*')
		.eq('id', postData.owner_id)
		.single()
	if (ownerError) {
		notFound()
	}

	const { count: numQuestions } = await supabase
		.from('questions')
		.select('id', { count: 'exact' })
		.eq('post_id', post.id)
	const { count: numBids } = await supabase
		.from('bids')
		.select('id', { count: 'exact' })
		.eq('post_id', post.id)

	const canEditPost =
		role === 'admin' || (id === post.owner_id && post.status === 'todo')
	const canReportPost = role !== 'admin' && id !== post.owner_id

	if (!post || (role !== 'admin' && post.status === 'hidden')) {
		notFound()
	} else {
		return (
			<>
				<PostProgress id={id} role={role} post={post} />

				<JobOverview
					post={post}
					owner={owner}
					canReport={canReportPost}
				/>

				{/* Details line */}
				<div className='relative'>
					<div
						className='absolute inset-0 flex items-center'
						aria-hidden='true'
					>
						<div className='w-full border-t border-gray-300' />
					</div>
					<div className='relative flex justify-center'>
						<span className='bg-white px-2 text-gray-500'>
							Details
						</span>
					</div>
				</div>

				{/* Details */}
				<p className='pb-12 pt-2'>{post.description}</p>
				{canEditPost && <EditPostAlert id={post.id} />}

				<PostTabs
					tabs={[
						{
							tab: 'Questions',
							count: numQuestions || 0,
							component: <QuestionSection post={post} />,
						},
						{
							tab: 'Bids',
							count: numBids || 0,
							component: (
								<BidSection id={id} post={post} owner={owner} />
							),
						},
					]}
				/>
			</>
		)
	}
}
