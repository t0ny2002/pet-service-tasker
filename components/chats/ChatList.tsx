'use client'

import ChatCard from './ChatCard'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChatT } from '@/lib/types/chats'
import { Filter } from '@/components/chats/Filter'
import useUserDetails from '@/lib/hooks/useUserDetails'

export default function ChatList({ chats }: { chats: ChatT[] }) {
	const router = useRouter()
	const { getDetails } = useUserDetails()
	const [filteredChats, setFilteredChats] = useState<ChatT[]>(chats)
	const params = useSearchParams()
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		let filtered = chats
		const search = params.get('search')
		if (search) {
			const { id } = getDetails()
			filtered = filtered.filter((chat) => {
				const otherUserName =
					chat.user1.id === id ? chat.user2.name : chat.user1.name
				return otherUserName
					.toLowerCase()
					.includes(search.toLowerCase())
			})
		}
		setFilteredChats(filtered)
		setMounted(true)
	}, [chats, getDetails, params])

	return (
		<main className='mx-auto w-full max-w-screen-md p-6 sm:p-10'>
			<Filter />

			{/* Here are the chats which adjust dynamically */}
			{(!mounted || filteredChats.length === 0) && (
				<p className='text-center text-gray-400'>No chats found</p>
			)}

			{mounted &&
				filteredChats.length > 0 &&
				filteredChats.map((chat) => (
					<ChatCard key={chat.id} chat={chat} router={router} />
				))}
		</main>
	)
}
