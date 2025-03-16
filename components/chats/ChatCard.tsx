'use client'

import useUserDetails from '@/lib/hooks/useUserDetails'
import { ChatT } from '@/lib/types/chats'
import { getDisplayDate } from '@/lib/helpers/dates'

type ChatProps = {
	chat: ChatT
	router: {
		push: (url: string) => void
	}
}

function ChatCard({ chat, router }: ChatProps) {
	const { getDetails } = useUserDetails()
	const { id } = getDetails()
	const displayDate = getDisplayDate(chat.created_at)

	// Check if the logged-in user is one of the users in the chat
	if (chat.user1.id !== id && chat.user2.id !== id) {
		return null
	}

	// Name of the other user in the chat
	const otherUserName =
		chat.user1.id === id ? chat.user2.name : chat.user1.name

	// To determine whether or not the blue dot shows
	// const chatUnread =
	// 	(chat.user1.id === id && !chat.user1_read_chat) ||
	// 	(chat.user2.id === id && !chat.user2_read_chat)

	return (
		<main className='w-full max-w-screen-md pt-5 sm:pt-6'>
			<button
				key={chat.id}
				className='flex h-full w-full max-w-full items-center justify-between gap-2 rounded-xl bg-white p-5 shadow-md ring-1 ring-inset ring-gray-200 duration-150 hover:scale-[1.02] hover:ring-indigo-600/50'
				onClick={() => {
					router.push(`/chat/${chat.id}`)
				}}
			>
				{/* Profile picture */}
				<div className='flex-shrink-0'>
					<span className='inline-block h-14 w-14 overflow-hidden rounded-full bg-gray-100'>
						{(
							chat.user1.id === id
								? chat.user2.image
								: chat.user1.image
						) ? (
							<img
								src={
									(chat.user1.id === id
										? chat.user2.image
										: chat.user1.image) || undefined
								}
								alt='Profile picture'
								className='h-full w-full object-cover'
							/>
						) : (
							<svg
								className='h-full w-full text-gray-300'
								fill={'currentColor'}
								viewBox='0 0 24 24'
							>
								<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
							</svg>
						)}
					</span>
				</div>

				{/* Other user name, post title, and last message */}
				<div className='ml-5 flex-grow'>
					<div className='text-start text-lg'>
						<span className='text-xl font-bold'>
							{otherUserName}
						</span>
						<span className='font-semi text-2xl'>
							&nbsp;&bull;&nbsp;
						</span>
						<span className='text-md text-slate-500'>
							{chat.post.title}
						</span>
					</div>
				</div>

				{/* Date/time and blue dot */}
				<div className='flex flex-col items-end'>
					<div>{displayDate}</div>
				</div>
			</button>
		</main>
	)
}
export default ChatCard
