import { Bids } from './Bids'
import { BidForm } from './BidForm'
import { OwnerDetails, PostBid, PostDetails } from '../index'
import { serverSupabase } from '@/lib/serverSupabase'

export const dynamic = 'force-dynamic'

interface Props {
	id: string | null
	post: PostDetails
	owner: OwnerDetails
}

export default async function BidSection({ id, post, owner }: Props) {
	const supabase = serverSupabase()

	const { data: bidsData, error: bidsError } = await supabase
		.from('bids')
		.select('*, users(*)')
		.eq('post_id', post.id)

	if (bidsError) {
		return <div>Error: {bidsError.message}</div>
	}
	const bids: PostBid[] = bidsData
		.map((bid) => ({
			id: bid.id,
			bidder_id: bid.bidder_id,
			bidder_firstName: bid.users?.firstName || 'Unknown',
			bidder_lastName: bid.users?.lastName || 'Unknown',
			amount: bid.amount,
			description: bid.description,
			selected: post !== null && post.selected_bidder === bid.bidder_id,
		}))
		.sort((a, b) => {
			// Sort selected bids first, then by descreasing price
			if (a.selected) return -1
			if (b.selected) return 1
			return a.amount < b.amount ? 1 : -1
		})

	return (
		<div>
			<Bids id={id} bids={bids} post={post} />
			<BidForm post={post} owner={owner} bids={bids} />
		</div>
	)
}
