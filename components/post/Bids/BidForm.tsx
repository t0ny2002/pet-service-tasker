'use client'
import { FormEvent, useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'
import toast from 'react-hot-toast'
import useUserDetails from '@/lib/hooks/useUserDetails'
import notification from '@/lib/helpers/notification'
import { OwnerDetails, PostBid, PostDetails } from '..'
import { useRouter } from 'next/navigation'

export function BidForm({
	post,
	owner,
	bids,
}: {
	post: PostDetails
	owner: OwnerDetails
	bids: PostBid[]
}) {
	const postid = post.id
	const { getDetails } = useUserDetails()
	const { id, role, firstName, lastName } = getDetails()
	const [mounted, setMounted] = useState(false)

	// Post Information
	const valueError = { value: '', error: false }
	const [bidAmount, setBidAmount] = useState(valueError)
	const [bidDescription, setBidDescription] = useState(valueError)
	const router = useRouter()

	const supabase = createClientComponentClient<Database>()
	useEffect(() => {
		setMounted(true)
	}, [])
	// Can User Bid
	const canUserBid =
		!bids.find((bid) => bid.bidder_id === id) &&
		role === 'carer' &&
		post.status === 'todo' &&
		mounted

	const handleSubmitBid = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		let error = false
		if (Number.parseInt(bidAmount.value) <= 0) {
			setBidAmount({ ...bidAmount, error: true })
			error = true
		}

		if (error) {
			return
		}

		const { error: bidderRowError } = await supabase.from('bids').insert({
			post_id: postid,
			amount: Number.parseInt(bidAmount.value),
			description: bidDescription.value,
		})
		if (bidderRowError) {
			toast.error('Bid post failed, please try again')
			return
		}

		if (owner && post && id) {
			await notification({
				kind: 'BID_MADE',
				message: `${firstName} ${lastName} has made a bid on your post, ${post.title}`,
				recipient: owner.id,
				sender: id,
				href: `/post/${postid}`,
			})
		}
		toast.success('Bid successfully sent!')
		router.refresh()
	}
	return (
		canUserBid && (
			<div className='py-8'>
				<form
					id='bidForm'
					onSubmit={(e) => handleSubmitBid(e)}
					className='bg-gray-100 flex flex-col p-4 rounded-lg'
				>
					<h2 className='text-2xl font-bold mb-3'>Make an Offer</h2>
					<label className='block text-black font-medium'>
						Amount
					</label>
					<div
						data-error={bidAmount.error}
						className='relative rounded-md flex flex-col flex-1 data-[error=true]:text-red-500'
					>
						<span
							data-error={bidAmount.error}
							className='absolute inset-y-0 left-0 pl-3 flex items-center  text-gray-600 data-[error=true]:text-red-500'
						>
							$
						</span>
						<input
							required
							type='number'
							name='amount'
							className='pl-7 pr-3 w-full py-2 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
							placeholder='Enter amount'
							value={bidAmount.value}
							data-error={bidAmount.error}
							min={0}
							onChange={(e) =>
								setBidAmount({
									value: e.target.value,
									error: false,
								})
							}
						/>
					</div>
					<span
						data-error={bidAmount.error}
						className='text-xs hidden data-[error=true]:inline data-[error=true]:text-red-500'
					>
						You must enter a valid bid amount!
					</span>

					<div className='mt-5'>
						<label className='block text-black font-medium'>
							Message
						</label>
						<textarea
							id='message'
							name='message'
							className='px-3 py-1 min-h-[3rem] w-full mt-1 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200'
							placeholder='Enter message (Optional)'
							value={bidDescription.value}
							onChange={(e) =>
								setBidDescription({
									value: e.target.value,
									error: false,
								})
							}
						/>
					</div>

					<button
						className='bg-black text-white px-3 py-2 rounded-lg mt-3'
						type='submit'
					>
						Make Bid
					</button>
				</form>
			</div>
		)
	)
}
