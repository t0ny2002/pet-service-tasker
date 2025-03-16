'use client'

import { classNames } from '@/lib/helpers/simple'
import { ReactNode, useState } from 'react'

type PostTab = {
	tab: string
	count: number
	component: ReactNode
}

export function PostTabs({ tabs }: { tabs: PostTab[] }) {
	const [selectedTab, setSelectedTab] = useState(0)

	return (
		<div>
			<div className='flex space-x-4 border-b border-gray-300'>
				{tabs.map((tab: PostTab, index: number) => {
					const isSelected = selectedTab === index

					return (
						<button
							key={tab.tab}
							className={classNames(
								'border-b-2 px-4 py-2 text-gray-700 hover:border-gray-300',
								isSelected
									? 'border-indigo-500'
									: 'border-transparent'
							)}
							onClick={() => setSelectedTab(index)}
						>
							<div className='text-md flex items-center gap-2'>
								{tab.tab}{' '}
								<span className='flex h-5 w-5 items-center justify-center rounded-full bg-indigo-500 text-xs text-white'>
									{tab.count}
								</span>
							</div>
						</button>
					)
				})}
			</div>
			{tabs[selectedTab].component}
		</div>
	)
}
