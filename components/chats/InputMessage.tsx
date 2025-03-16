'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'
import { useState } from 'react'
import notification from '@/lib/helpers/notification'

export default function InputMessage({
	chat_id,
	user_id,
	other_user_id,
}: {
	chat_id: number
	user_id: string
	other_user_id: string
}) {
	const [message, setMessage] = useState('')

	const supabase = createClientComponentClient<Database>()

	// Insert new message into supabase
	async function sendMessage() {
		if (!message) {
			return
		}

		const { error } = await supabase.from('messages').insert({
			chat_id,
			user_id,
			message,
		})

		await notification({
			kind: 'MESSAGE',
			recipient: other_user_id,
			href: `/chat/${chat_id}`,
			sender: user_id,
			message: 'You have a new message!',
		})

		if (error) {
			console.error(error)
		}

		setMessage('')
	}

	return (
		<div className='flex w-full flex-row items-center justify-center bg-white px-4 pb-4'>
			<input
				type='text'
				placeholder='Type a message...'
				className='mr-4 w-full rounded-lg border border-gray-200 bg-gray-200 px-4 py-2 text-sm text-gray-700 focus:border-gray-300 focus:outline-none'
				value={message}
				onChange={(e) => setMessage(e.target.value)}
				onKeyUp={(e) => {
					if (e.key === 'Enter') {
						sendMessage()
					}
				}}
			/>
			<button
				className='rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white hover:bg-indigo-500 focus:bg-indigo-500 focus:outline-none'
				onClick={sendMessage}
			>
				Send
			</button>
		</div>
	)
}
