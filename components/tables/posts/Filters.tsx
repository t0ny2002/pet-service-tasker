import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/solid'

import { TaskProgress } from '@/lib/types/global'
import { categories } from '@/lib/constants'
import { capitalise } from '@/lib/helpers/simple'

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

export function PostFilters({ count }: { count: number }) {
	const router = useRouter()
	const params = useSearchParams()

	const [search, setSearch] = useState('')
	const [status, setStatus] = useState<Status>('all')
	const [category, setCategory] = useState<string>('all')

	const updateParams = (search: string, status: Status, category: string) => {
		const params = new URLSearchParams()
		if (search.length > 0) {
			params.append('search', search)
		}
		if (status !== 'all') {
			params.append('status', status)
		}
		if (category !== 'all') {
			params.append('category', category)
		}
		const query = params.toString()
		router.replace(`/admin/posts${query ? '?' + query : ''}`)
	}

	const onSubmit = async (e?: FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault()
		updateParams(search, status, category)
	}

	const onChangeStatus = (e: ChangeEvent<HTMLSelectElement>) => {
		const newStatus = e.target.value
		if (isOfTypeStatus(newStatus)) {
			setStatus(newStatus)
			updateParams(search, newStatus, category)
		}
	}

	const onChangeCategory = (e: ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value
		if (newCategory === 'all' || categories.includes(newCategory)) {
			setCategory(newCategory)
			updateParams(search, status, newCategory)
		}
	}

	useEffect(() => {
		const searchParam = params.get('search')
		const statusParam = params.get('status')
		const categoryParam = params.get('category')
		if (searchParam !== null && searchParam !== '') {
			setSearch(searchParam)
		}
		if (statusParam !== null && isOfTypeStatus(statusParam)) {
			setStatus(statusParam)
		}
		if (categoryParam !== null && categories.includes(categoryParam)) {
			setCategory(categoryParam)
		}
	}, [params])

	return (
		<div className='mt-6 flex flex-col gap-3 md:flex-row'>
			{/* Search Filter */}
			<div className='flex-1'>
				<label
					htmlFor='search'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Search posts ({count})
				</label>
				<form
					onSubmit={onSubmit}
					className='mt-2 flex rounded-md shadow-sm'
				>
					<div className='relative flex flex-grow items-stretch focus-within:z-10'>
						<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
							<FunnelIcon
								className='h-5 w-5 text-gray-400'
								aria-hidden='true'
							/>
						</div>
						<input
							type='text'
							name='search'
							id='search'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							className='block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
							placeholder='Search'
						/>
					</div>
					<button
						type='button'
						onClick={() => onSubmit()}
						className='relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
					>
						<MagnifyingGlassIcon
							className='-ml-0.5 h-5 w-5 text-gray-400'
							aria-hidden='true'
						/>
						Search
					</button>
				</form>
			</div>

			{/* Select Category Filter */}
			<div>
				<label
					htmlFor='task-status'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Category
				</label>
				<select
					id='task-status'
					name='task-status'
					className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
					value={category}
					onChange={onChangeCategory}
				>
					<option value='all'>All</option>
					{categories.map((category) => (
						<option key={category} value={category}>
							{capitalise(category)}
						</option>
					))}
				</select>
			</div>

			{/* Select Status Filter */}
			<div>
				<label
					htmlFor='task-status'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Status
				</label>
				<select
					id='task-status'
					name='task-status'
					className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
					value={status}
					onChange={onChangeStatus}
				>
					<option value='all'>All</option>
					<option value='todo'>Open</option>
					<option value='progress'>In Progress</option>
					<option value='done'>Finished</option>
					<option value='paid'>Paid</option>
					<option value='complete'>Closed</option>
					<option value='hidden'>Hidden</option>
				</select>
			</div>
		</div>
	)
}
