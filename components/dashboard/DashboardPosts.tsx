'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { DashboardTab } from '@/lib/helpers/dashboard'
import { PostT } from '@/lib/helpers/posts'
import { classNames } from '@/lib/helpers/simple'
import PostList from '@/components/posts/PostList'

export function DashboardPosts({
	tabs,
	posts,
}: {
	tabs: DashboardTab[]
	posts: PostT[]
}) {
	const router = useRouter()
	const params = useSearchParams()

	const renderSelect = (tab: DashboardTab) => {
		const numPosts = posts.filter((post) => {
			return tab.accept.includes(post.status)
		}).length
		return (
			<option key={tab.value} value={tab.value}>
				{tab.name} ({numPosts})
			</option>
		)
	}
	const renderTabButton = (tab: DashboardTab) => {
		const isSelected = (params.get('selected') || 'open') === tab.value
		const numPosts = posts.filter((post) => {
			return tab.accept.includes(post.status)
		}).length

		return (
			<button
				key={tab.value}
				className={classNames(
					'px-4 py-2 text-gray-700 hover:border-b-2 hover:text-gray-900',
					isSelected ? 'border-b-2 border-indigo-500' : ''
				)}
				onClick={() =>
					router.replace(`/dashboard?selected=${tab.value}`)
				}
			>
				<div className='flex items-center gap-2'>
					<div className='text-md ml-2'>{tab.name}</div>
					{tab.value !== 'paid' && numPosts > 0 && (
						<div className='flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white'>
							{numPosts}
						</div>
					)}
				</div>
			</button>
		)
	}

	return (
		<section>
			<div className='mb-4 flex flex-col items-center justify-center'>
				<div className='hidden flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0 md:flex'>
					{tabs.map(renderTabButton)}
				</div>
				<select
					onChange={(e) =>
						router.replace(`/dashboard?selected=${e.target.value}`)
					}
					value={params.get('selected') || 'open'}
					className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 md:hidden'
				>
					{tabs.map(renderSelect)}
				</select>
				<PostList posts={posts} tabs={tabs} />
			</div>
		</section>
	)
}
