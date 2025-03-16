'use client'

import { useState, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

import { PostT } from '@/lib/helpers/posts'
import { DashboardTab } from '@/lib/helpers/dashboard'
import { Filter } from '@/components/posts/Filter'
import { Post } from './Post'

export default function PostList({
	posts,
	tabs,
}: {
	posts: PostT[]
	tabs?: DashboardTab[]
}) {
	const pathname = usePathname()
	const params = useSearchParams()

	const [mounted, setMounted] = useState(false)
	const [filteredPosts, setFilteredPosts] = useState<PostT[]>(posts)

	useEffect(() => {
		let filtered = posts
		if (pathname === '/dashboard' && tabs) {
			const selected = params.get('selected') || 'open'
			const tab = tabs.find((tab) => tab.value === selected) || tabs[0]
			filtered = filtered.filter((post) =>
				tab.accept.includes(post.status)
			)
		}
		const search = params.get('search')
		if (search) {
			filtered = filtered.filter(
				(post) =>
					post.title.toLowerCase().includes(search.toLowerCase()) ||
					post.category
						.toLowerCase()
						.includes(search.toLowerCase()) ||
					post.location.toLowerCase().includes(search.toLowerCase())
			)
		}
		const startDate = params.get('start')
		const endDate = params.get('end')
		if (startDate && endDate && validateDates(startDate, endDate)) {
			filtered = filtered.filter((post) => {
				const postDate = new Date(post.createdAt)
				const filterStartDate = new Date(startDate)
				const filterEndDate = new Date(endDate)
				filterStartDate.setHours(0, 0, 0, 0)
				filterEndDate.setHours(23, 59, 59, 999)
				return postDate >= filterStartDate && postDate <= filterEndDate
			})
		}

		const category = params.get('category')
		if (category) {
			filtered = filtered.filter((post) => post.category === category)
		}

		setFilteredPosts(filtered)
		setMounted(true)
	}, [posts, pathname, params, tabs])

	return (
		<section className='flex w-full flex-col items-center justify-center gap-4'>
			<Filter />

			{/* Here are the posts which adjust dynamically */}
			{(!mounted || filteredPosts.length === 0) && (
				<p className='text-lg font-semibold text-gray-500'>
					No posts available.
				</p>
			)}
			{mounted && filteredPosts.length > 0 && (
				<div className='grid w-full items-center justify-items-center gap-4 md:grid-cols-2 xl:grid-cols-3'>
					{filteredPosts.map((post) => (
						<Post key={post.id} post={post} />
					))}
				</div>
			)}
		</section>
	)
}

// Help function for filtering, finding all posts between two dates
const validateDates = (fromDate: string, toDate: string) => {
	const fromDateObj = new Date(fromDate)
	const toDateObj = new Date(toDate)
	return fromDateObj <= toDateObj
}
