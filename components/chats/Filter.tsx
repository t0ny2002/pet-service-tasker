import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Input } from '../elements'

export function Filter() {
	const path = usePathname()
	const router = useRouter()
	const params = useSearchParams()

	// For search filtering
	const updateSearch = (search: string) => {
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

		router.replace(`${path}?${query.toString()}`)
	}

	useEffect(() => {
		const search = params.get('search')
		setSearch(search || '')
	}, [params])

	// For date filtering chats
	const [search, setSearch] = useState('')

	return (
		<>
			<div className='flex w-full flex-col items-center gap-4 pt-4 sm:flex-row'>
				<Input
					id='search'
					name='chat-search'
					value={search}
					placeholder='Search Chats'
					onChange={({ value }) => updateSearch(value)}
					fullWidth
				/>
			</div>
		</>
	)
}
