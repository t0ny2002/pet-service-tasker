import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button, Input } from '../elements'
import { Modal } from '../modals'
import { categories } from '@/lib/constants'

export function Filter() {
	const path = usePathname()
	const router = useRouter()
	const params = useSearchParams()

	// For search filtering
	const updateSearch = (
		search: string,
		startDate: string,
		endDate: string,
		category: string
	) => {
		const query = new URLSearchParams()
		for (const [key, value] of params.entries()) {
			query.set(key, value)
		}

		if (search) {
			query.set('search', search)
			setSearch(search)
		} else {
			query.delete('search')
		}

		if (startDate) {
			query.set('start', startDate)
			setStartDate(startDate)
		} else {
			query.delete('start')
		}

		if (startDate) {
			query.set('end', endDate)
			setEndDate(endDate)
		} else {
			query.delete('end')
		}

		if (category) {
			query.set('category', category)
			setCategory(category)
		} else {
			query.delete('category')
		}

		router.replace(`${path}?${query.toString()}`)
	}

	useEffect(() => {
		const search = params.get('search')
		const startDate = params.get('start')
		const endDate = params.get('end')
		const category = params.get('category')

		setSearch(search || '')

		let datesSet = false
		if (startDate !== null && /^\d{4}-\d{2}-\d{2}$|^$/.test(startDate)) {
			setStartDate(startDate)
			datesSet = true
		}

		if (endDate !== null && /^\d{4}-\d{2}-\d{2}$|^$/.test(endDate)) {
			setEndDate(endDate)
		} else {
			datesSet = false
		}

		if (category !== null && categories.includes(category)) {
			setCategory(category)
		}

		if (
			startDate &&
			endDate &&
			datesSet &&
			!validateDates(startDate, endDate)
		) {
			setDateError(true)
		} else {
			setDateError(false)
		}
	}, [params])

	// For date filtering posts
	const [search, setSearch] = useState('')

	const [filterModal, setFilterModal] = useState(false)
	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const [dateError, setDateError] = useState(false)

	// For category filtering posts
	const [category, setCategory] = useState('')

	const clearFilter = () => {
		updateSearch(search, '', '', '')
		setStartDate('')
		setEndDate('')
		setDateError(false)
		setCategory('')
	}

	const clearDates = () => {
		updateSearch(search, '', '', category)
		setStartDate('')
		setEndDate('')
		setDateError(false)
	}

	const clearCategory = () => {
		updateSearch(search, startDate, endDate, '')
		setCategory('')
	}

	return (
		<>
			<div className='flex w-full flex-col items-center gap-4 pt-4 sm:flex-row'>
				<Input
					id='search'
					name='post-search'
					value={search}
					placeholder='Search Posts'
					onChange={({ value }) =>
						updateSearch(value, startDate, endDate, category)
					}
					fullWidth
				/>
				<div className='w-full sm:w-fit sm:min-w-[100px]'>
					<Button
						size='lg'
						onClick={() => setFilterModal(true)}
						fullWidth
					>
						Filters
					</Button>
				</div>
			</div>
			{filterModal && (
				<Modal close={() => setFilterModal(false)}>
					<h3 className='text-lg font-semibold'>Date Filter</h3>
					<section className='mb-2 flex gap-4'>
						<input
							type='date'
							placeholder='From Date'
							value={startDate}
							onChange={(e) => {
								updateSearch(
									search,
									e.target.value,
									endDate,
									category
								)
							}}
							className={`border ${
								dateError ? 'border-red-500' : 'border-gray-300'
							} rounded p-2`}
						/>
						<input
							type='date'
							placeholder='To Date'
							value={endDate}
							onChange={(e) => {
								updateSearch(
									search,
									startDate,
									e.target.value,
									category
								)
							}}
							className={`border ${
								dateError ? 'border-red-500' : 'border-gray-300'
							} rounded p-2`}
						/>
					</section>
					{dateError && (
						<p className='-mt-4 text-sm text-red-500'>
							Ending date cannot be before starting date
						</p>
					)}
					<Button kind='secondary' size='lg' onClick={clearDates}>
						Clear
					</Button>
					<hr className='my-4 border-t-2 border-gray-300' />
					<h3 className='text-lg font-semibold'>Category Filter</h3>
					<select
						value={category}
						onChange={(e) => {
							updateSearch(
								search,
								startDate,
								endDate,
								e.target.value
							)
						}}
					>
						{' '}
						<option value='' disabled selected>
							Choose category
						</option>
						{categories.map((category) => (
							<option key={category} value={category}>
								{category}
							</option>
						))}
					</select>
					<Button kind='secondary' size='lg' onClick={clearCategory}>
						Clear
					</Button>
					<hr className='my-4 border-t-2 border-gray-300' />

					<div className='flex  justify-center gap-4'>
						<Button
							kind='secondary'
							size='lg'
							onClick={clearFilter}
						>
							Clear All
						</Button>
						<Button size='lg' onClick={() => setFilterModal(false)}>
							Save and Close
						</Button>
					</div>
				</Modal>
			)}
		</>
	)
}

// Help function for filtering, finding all posts between two dates
const validateDates = (fromDate: string, toDate: string) => {
	const fromDateObj = new Date(fromDate)
	const toDateObj = new Date(toDate)
	return fromDateObj <= toDateObj
}
