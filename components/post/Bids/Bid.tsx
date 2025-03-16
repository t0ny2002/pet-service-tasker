'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { PostBid, PostDetails } from '..'
import { supabase } from '@/lib/clientSupabase'
import Report from '@/components/Report'
import { BiCheck } from 'react-icons/bi'
import Link from 'next/link'

export function Bid({
	id,
	bid,
	post,
	setSelectedBid,
}: {
	id: string
	bid: PostBid
	post: PostDetails
	setSelectedBid: Dispatch<SetStateAction<PostBid | null>>
}) {
	const [bidder, setBidder] = useState<{
		name: string
		image_url: string | null
	} | null>()

	useEffect(() => {
		const fetchBidder = async () => {
			const { data: bidder } = await supabase
				.from('users')
				.select('firstName, lastName, image_url')
				.eq('id', bid.bidder_id)
				.single()
			setBidder(
				bidder && {
					name: bidder.firstName + ' ' + bidder.lastName,
					image_url: bidder.image_url,
				}
			)
		}
		fetchBidder()
	}, [bid])

	return (
		<li className='flex items-start gap-x-4 px-2 py-3'>
			<Link href={`/profile/${bid.bidder_id}`}>
				{bidder?.image_url ? (
					<img
						src={bidder.image_url}
						alt='Profile Picture'
						className='h-8 w-8 rounded-full'
					/>
				) : (
					<span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100'>
						<svg
							className='h-full w-full text-gray-300'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
						</svg>
					</span>
				)}
			</Link>
			<div className='flex-grow'>
				<span className='flex items-center'>
					<Link
						href={`/profile/${bid.bidder_id}`}
						className='font-semibold'
					>
						{bid.bidder_firstName} {bid.bidder_lastName}{' '}
					</Link>
					{bid.selected && (
						<span className='ml-2 inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
							Assigned
						</span>
					)}
					{id !== bid.bidder_id && (
						<span className='ml-2'>
							<Report ref_id={String(bid.id)} type='Bid' />
						</span>
					)}
				</span>
				{bid.description && (
					<p className='text-sm text-gray-700'>{bid.description}</p>
				)}
			</div>
			<p>${bid.amount}</p>
			{id === post?.owner_id && post.status === 'todo' && (
				<button
					onClick={() => setSelectedBid(bid)}
					className='inline-flex justify-center rounded-md bg-green-600 p-1 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:px-3'
				>
					<span className='hidden sm:block'>Choose</span>
					<BiCheck size={20} className='sm:hidden' />
				</button>
			)}
		</li>
	)
}
