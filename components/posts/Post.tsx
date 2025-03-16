'use client'

import { FaCalendar } from 'react-icons/fa'
import { MapPinIcon } from '@heroicons/react/24/solid'
import { formatSimpleDate } from '@/lib/helpers/dates'
import SkillIcon from '../SkillIcon'

import { PostT, basicStatusDetails } from '@/lib/helpers/posts'
import Link from 'next/link'
import { classNames } from '@/lib/helpers/simple'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { useCallback } from 'react'

export function Post({
	post,
	dashboard = false,
}: {
	post: PostT
	dashboard?: boolean
}) {
	const { getDetails } = useUserDetails()
	const { id, role } = getDetails()
	const { colour, text: statusText } = basicStatusDetails(post.status)

	const supportText = useCallback(() => {
		if (post.status === 'todo') {
			const userBid = post.bids.find((bid) => bid.uid === id)
			if (dashboard && role === 'carer' && userBid) {
				return (
					<span className='ml-1.5'>
						{'• '}
						You bid ${userBid.amount}
					</span>
				)
			}
			return (
				<>
					<span className='ml-1.5'>
						{'• '}
						{post.bids.length}{' '}
						{post.bids.length === 1 ? 'Bid' : 'Bids'}
					</span>
					<span className='ml-1.5'>
						{'• '}
						{post.questions} Q&A
					</span>
				</>
			)
		} else if (post.status === 'progress' && post.carer) {
			return (
				<span className='ml-1.5'>
					by {post.carer.id === id ? 'you' : post.carer.name}
				</span>
			)
		} else if (post.status === 'done') {
			return (
				<span className='ml-1.5'>
					{'• '}
					Awaiting Payment
				</span>
			)
		}
	}, [id, role, dashboard, post])

	return (
		<Link
			href={`/post/${post.id}`}
			className='flex h-full w-full max-w-full flex-col gap-2 rounded-xl bg-white p-5 shadow-md ring-1 ring-inset ring-gray-200 duration-150 hover:scale-[1.02] hover:ring-indigo-600/50'
		>
			<div className='flex gap-2 text-lg font-semibold text-gray-800'>
				<span className='max-w-full flex-1'>{post.title}</span>
				{post.bidAmount && (
					<span className='font-bold'>${post.bidAmount}</span>
				)}
			</div>

			<div className='flex flex-1 gap-2'>
				<div className='flex flex-1 flex-col gap-2 pl-1 text-gray-600'>
					<span className='flex items-center gap-2'>
						<FaCalendar className='h-4 w-4 text-gray-400' />
						<span>{formatSimpleDate(post.createdAt)}</span>
					</span>

					<span className='flex items-center gap-2'>
						<MapPinIcon className='h-4 w-4 text-gray-400' />
						<span>{post.location}</span>
					</span>

					<div className='flex items-center gap-2'>
						<SkillIcon
							skill={post.category}
							className='h-4 w-4 text-gray-400'
						/>
						<span>{post.category}</span>
					</div>

					<div className='-pl-1 mt-auto flex overflow-clip text-gray-500'>
						<span className={classNames('font-bold', colour)}>
							{statusText}
						</span>
						{supportText()}
					</div>
				</div>

				{/* Profile picture */}
				<span className='mb-0 mt-auto inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
					{post.owner.image_url ? (
						<img
							src={post.owner.image_url}
							alt='Profile picture'
							className='h-full w-full object-cover'
						/>
					) : (
						<svg
							className='h-full w-full text-gray-300'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
						</svg>
					)}
				</span>
			</div>
		</Link>
	)
}
