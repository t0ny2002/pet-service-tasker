'use client'
import { PostBid, PostDetails } from '..'
import { useState } from 'react'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { supabase } from '@/lib/clientSupabase'
import toast from 'react-hot-toast'
import notification from '@/lib/helpers/notification'
import { ConfirmBidderModal } from './ConfirmBidderModal'
import { useRouter } from 'next/navigation'
import { Bid } from './Bid'

export function Bids({
	id,
	bids,
	post,
}: {
	id: string | null
	bids: PostBid[]
	post: PostDetails
}) {
	const { getDetails } = useUserDetails()
	const { firstName, lastName } = getDetails()
	const [selectedBid, setSelectedBid] = useState<PostBid | null>(null)
	const router = useRouter()

	const handleSelectBidder = async () => {
		if (post.selected_bidder || !selectedBid) return
		const { error } = await supabase
			.from('posts')
			.update({
				status: 'progress',
				selected_bidder: selectedBid.bidder_id,
			})
			.eq('id', post.id)
		if (error) {
			toast.error('Could not confirm carer, try again')
			return
		}
		await notification({
			kind: 'BID_CHOSEN',
			message: `${firstName} ${lastName} has chosen you for their post, "${post.title}"`,
			recipient: selectedBid.bidder_id,
			sender: post.owner_id,
			href: `/post/${post.id}`,
		})
		toast.success('Successfully selected a carer')

		// Add new chat to chats table
		const { error: error2 } = await supabase.from('chats').insert([
			{
				post_id: post.id,
				user1_id: post.owner_id,
				user2_id: selectedBid.bidder_id,
			},
		])
		if (error2) {
			toast.error('Could not create chat, try again')
			return
		}

		router.refresh()
		setSelectedBid(null)
	}
	return (
		<>
			<ul role='list' className='divide-y divide-gray-200'>
				{bids.map((bid) => (
					<Bid
						key={bid.id}
						id={id || ''}
						bid={bid}
						post={post}
						setSelectedBid={setSelectedBid}
					/>
				))}
			</ul>
			<ConfirmBidderModal
				selectedBid={selectedBid}
				setSelectedBid={setSelectedBid}
				handleSelectBidder={handleSelectBidder}
			/>
		</>
	)
}
