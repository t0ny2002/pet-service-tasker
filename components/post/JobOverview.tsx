import Link from 'next/link'
import { OwnerDetails, PostDetails } from '.'

import { AiFillCalendar } from 'react-icons/ai'
import { BiSolidCategory } from 'react-icons/bi'
import { FaLocationDot } from 'react-icons/fa6'
import { IoTimerSharp } from 'react-icons/io5'
import { PostStatusPill } from './PostProgress/StatusPill'
import Report from '@/components/Report'

export function JobOverview({
	post,
	owner,
	canReport,
}: {
	post: PostDetails
	owner: OwnerDetails
	canReport: boolean
}) {
	return (
		<div>
			<div>
				<div className='flex items-center justify-between'>
					{/* Owner name with image */}
					{owner && (
						<Link
							href={'/profile/' + owner.id}
							className='mb-2 flex items-center gap-4'
						>
							{owner.image_url ? (
								<img
									src={owner.image_url}
									alt='Profile Picture'
									className='h-10 w-10 rounded-full'
								/>
							) : (
								<span className='inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
									<svg
										className='h-full w-full text-gray-300'
										fill='currentColor'
										viewBox='0 0 24 24'
									>
										<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
									</svg>
								</span>
							)}
							<p className='font-bold'>
								{owner.firstName} {owner.lastName}
							</p>
						</Link>
					)}
					{canReport && (
						<Report ref_id={String(post.id)} type='Post' />
					)}
				</div>

				<div className='mb-2 flex items-center justify-between gap-2'>
					<h2 className='text-2xl font-bold'>{post.title}</h2>
					<PostStatusPill status={post.status} />
				</div>

				{/* Post Image */}
				{post.image_URL && (
					<img
						src={post.image_URL}
						alt='Post Image'
						className='mb-2 rounded object-cover'
					/>
				)}
			</div>

			{/* For Key Details */}
			<div className='flex flex-col gap-3 py-3'>
				<div className='flex gap-4'>
					<AiFillCalendar size={24} className='text-gray-400' />
					<p>{post.start_time}</p>
				</div>
				<div className='flex gap-4'>
					<IoTimerSharp size={24} className='text-gray-400' />
					<p>{post.duration}</p>
				</div>
				<div className='flex gap-4'>
					<FaLocationDot size={24} className='text-gray-400' />
					<p>{post.location}</p>
				</div>
				<div className='flex gap-4'>
					<BiSolidCategory size={24} className='text-gray-400' />
					<p>{post.category}</p>
				</div>
			</div>
		</div>
	)
}
