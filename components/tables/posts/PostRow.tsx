import Link from 'next/link'
import { PostStatusPill } from '@/components/post/PostProgress/StatusPill'

type Post = {
	id: number
	title: string
	status: string
	location: string
	category: string
	startTime: string
	ownerId: string
	ownerName: string
}

export function PostRow({ post }: { post: Post }) {
	return (
		<tr>
			<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0'>
				<div>
					<Link
						href={`/post/${post.id}`}
						className='font-medium text-indigo-600 hover:underline'
					>
						{post.title}
					</Link>
					<div className='mt-1 text-xs text-gray-500 lg:hidden'>
						{post.location} on {post.startTime}
					</div>
					<Link
						href={`/profile/${post.ownerId}`}
						className='mt-1 text-xs font-medium hover:underline md:hidden'
					>
						{post.ownerName}
					</Link>
				</div>
			</td>
			<td className='hidden whitespace-nowrap px-3 py-4 text-sm font-medium text-gray-800 md:table-cell'>
				<Link
					href={`/profile/${post.ownerId}`}
					className='hover:underline'
				>
					{post.ownerName}
				</Link>
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
				{post.category}
			</td>
			<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
				<PostStatusPill status={post.status} />
			</td>
			<td className='hidden px-3 py-4 text-sm text-gray-500 lg:table-cell'>
				<div>{post.location}</div>
				<div className='hidden lg:block xl:hidden'>
					{post.startTime}
				</div>
			</td>
			<td className='hidden px-3 py-4 text-sm text-gray-500 xl:table-cell'>
				{post.startTime}
			</td>
			<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
				<Link
					href={`/post/${post.id}/edit`}
					className='text-indigo-600 hover:text-indigo-900'
				>
					Edit
					<span className='sr-only'>, {post.title}</span>
				</Link>
			</td>
		</tr>
	)
}
