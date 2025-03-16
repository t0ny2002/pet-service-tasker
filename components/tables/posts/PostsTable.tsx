'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { TaskProgress } from '@/lib/types/global'
import { capitalise } from '@/lib/helpers/simple'
import { categories } from '@/lib/constants'
import { PostFilters } from './Filters'
import { PostTitles } from './Titles'
import { PostRow } from './PostRow'

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

type Status = TaskProgress | 'all'
function isOfTypeStatus(keyInput: string): keyInput is Status {
	return [
		'all',
		'todo',
		'progress',
		'done',
		'paid',
		'complete',
		'hidden',
	].includes(keyInput)
}

export function PostsTable({ posts }: { posts: Post[] }) {
	const params = useSearchParams()

	const [filtered, setFiltered] = useState<Post[]>(posts)

	useEffect(() => {
		const searchParam = params.get('search')
		const statusParam = params.get('status')
		const categoryParam = params.get('category')

		let filteredPosts = posts
		if (searchParam !== null && searchParam !== '') {
			filteredPosts = filteredPosts.filter(
				(post) =>
					post.title
						.toLowerCase()
						.includes(searchParam.toLowerCase()) ||
					post.ownerName
						.toLowerCase()
						.includes(searchParam.toLowerCase()) ||
					post.location
						.toLowerCase()
						.includes(searchParam.toLowerCase())
			)
		}
		if (statusParam !== null && isOfTypeStatus(statusParam)) {
			if (statusParam !== 'all') {
				filteredPosts = filteredPosts.filter(
					(post) => post.status === statusParam
				)
			}
		}
		if (categoryParam !== null && categories.includes(categoryParam)) {
			if (categoryParam !== 'all') {
				filteredPosts = filteredPosts.filter(
					(post) => post.category === capitalise(categoryParam)
				)
			}
		}
		setFiltered(filteredPosts)
	}, [posts, params])

	return (
		<>
			<PostFilters count={filtered.length} />

			{/* User Table */}
			<div className='mt-2 flow-root'>
				<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
						<table className='min-w-full divide-y divide-gray-300'>
							<PostTitles />
							<tbody className='divide-y divide-gray-200 bg-white'>
								{filtered.map((post) => (
									<PostRow key={post.id} post={post} />
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}
