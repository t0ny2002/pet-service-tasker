'use client'

import { ChatMessage } from '@/lib/types/chats'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'
import { useEffect, useState } from 'react'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { notFound } from 'next/navigation'
import InputMessage from '@/components/chats/InputMessage'
import MessageDate from '@/components/chats/MessageDate'
import ProfileImage from '@/components/chats/ProfileImage'
import { PostStatusPill } from '@/components/post/PostProgress/StatusPill'
import Link from 'next/link'

export default function RealtimeChatPage({
	serverMessages,
	chatInfo,
	postInfo,
}: {
	serverMessages: ChatMessage[]
	chatInfo: {
		id: number
		created_at: string
		user1_id: string
		user2_id: string
		post_id: number
	}
	postInfo: {
		id: number
		title: string
		status: string
		owner_id: string
		selected_bidder: string | null
	} | null
}) {
	const [otherUserFirstName, setOtherUserFirstName] = useState<string>('')
	const [otherUserLastName, setOtherUserLastName] = useState<string>('')

	const [msgs, setMsgs] = useState(serverMessages)
	const [otherImageURL, setOtherImageURL] = useState<string | null>(null)
	const [currentUserImageURL, setCurrentUserImageURL] = useState<
		string | null
	>(null)
	const supabase = createClientComponentClient<Database>()

	// Get user id of current user and other user.
	const { getDetails } = useUserDetails()
	const { id: currentUserId } = getDetails()

	if (!currentUserId) {
		notFound()
	}

	const otherUserId =
		currentUserId === chatInfo.user1_id
			? chatInfo.user2_id
			: chatInfo.user1_id

	if (!otherUserId) {
		notFound()
	}

	// Get the names and image urls for the chat users.

	useEffect(() => {
		async function fetchUserDetails() {
			const { data: otherUserData, error } = await supabase
				.from('users')
				.select('firstName, lastName, image_url')
				.eq('id', otherUserId)
				.single()

			if (error) {
				console.error(error)
				return null
			}

			if (!currentUserId) {
				notFound()
			}
			const { data: currentUserData, error: currentUserError } =
				await supabase
					.from('users')
					.select('image_url')
					.eq('id', currentUserId)
					.single()

			if (currentUserError) {
				console.error(currentUserError)
				return null
			}

			setOtherUserFirstName(otherUserData.firstName)
			setOtherUserLastName(otherUserData.lastName)
			setOtherImageURL(otherUserData.image_url)
			setCurrentUserImageURL(currentUserData.image_url)
		}
		fetchUserDetails()
	}, [chatInfo, currentUserId, otherUserId, supabase])

	// Subscribe to realtime inserts to messages table.
	useEffect(() => {
		const channel = supabase
			.channel('realtime chats')
			.on(
				'postgres_changes',
				{ event: 'INSERT', schema: 'public', table: 'messages' },
				(payload) => {
					setMsgs([...msgs, payload.new as ChatMessage])
				}
			)
			.subscribe()

		return () => {
			supabase.removeChannel(channel)
		}
	}, [supabase, msgs, setMsgs])

	return (
		<div className='flex h-0 flex-grow flex-col overflow-auto'>
			{/* Card at the top of the chat */}
			<div className='border-gray border-b bg-gray-200 bg-opacity-10 p-5 text-black shadow-md'>
				<h1 className='flex items-center'>
					<ProfileImage imageURL={otherImageURL} size='h-12 w-12' />
					<Link
						href={`/profile/${otherUserId}`}
						className='ml-4 text-4xl font-bold hover:underline'
					>
						{otherUserFirstName} {otherUserLastName}
					</Link>
				</h1>
				<h2 className='pt-2 text-xl font-semibold'>
					<Link
						href={`/post/${postInfo?.id}`}
						className='hover:underline'
					>
						{postInfo?.title}
					</Link>
				</h2>
				<div className='flex items-center pt-2'>
					{postInfo?.status ? (
						<PostStatusPill status={postInfo.status} />
					) : null}
					<h4 className='pl-2 text-gray-500'>
						{postInfo?.selected_bidder === currentUserId
							? 'Assigned to you'
							: `Assigned to ${otherUserFirstName}`}
					</h4>
				</div>
			</div>

			{/* Chat messages */}
			<div className='flex flex-1 flex-col-reverse overflow-auto p-4'>
				{[...msgs].reverse().map((msg) => {
					if (msg.user_id === currentUserId) {
						return (
							<div
								key={msg.id}
								className='ml-auto mt-2 flex w-full max-w-xs justify-end space-x-3'
							>
								<div>
									<div className='text-right text-xs text-gray-500'>
										You
									</div>
									<div className='rounded-l-lg rounded-br-lg bg-blue-600 p-2 text-white'>
										<p className='text-sm'>{msg.message}</p>
									</div>
									<div className='text-right'>
										<span className='text-xs leading-none text-gray-500'>
											<MessageDate message={msg} />
										</span>
									</div>
								</div>
								<div className='min-w-[36px]'>
									<ProfileImage
										imageURL={currentUserImageURL}
										size='h-9 w-9'
									/>
								</div>
							</div>
						)
					} else {
						return (
							<div
								key={msg.id}
								className='mt-2 flex w-full max-w-xs space-x-3'
							>
								<div className='min-w-[36px]'>
									<ProfileImage
										imageURL={otherImageURL}
										size='h-9 w-9'
									/>
								</div>
								<div>
									<div className='text-left text-xs text-gray-500'>
										{otherUserFirstName}
									</div>
									<div className='rounded-r-lg rounded-bl-lg bg-gray-300 p-2'>
										<p className='text-sm'>{msg.message}</p>
									</div>
									<span className='text-xs leading-none text-gray-500'>
										<MessageDate message={msg} />
									</span>
								</div>
							</div>
						)
					}
				})}
			</div>

			{/* Place to enter/send text */}
			<InputMessage
				chat_id={Number(chatInfo.id)}
				user_id={currentUserId}
				other_user_id={otherUserId}
			/>
		</div>
	)
}
