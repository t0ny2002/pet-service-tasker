'use client'

import { useState, useEffect } from 'react'
import { ChatMessage } from '@/lib/types/chats'
import { formatMsgDate } from '@/lib/helpers/dates'

// Function to format the date of a message every minute
export default function MessageDate({ message }: { message: ChatMessage }) {
	const [formattedDate, setFormattedDate] = useState(
		formatMsgDate(message.created_at)
	)
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	useEffect(() => {
		const intervalId = setInterval(() => {
			setFormattedDate(formatMsgDate(message.created_at))
		}, 60000) // Update every minute

		// Clear the interval when the component unmounts
		return () => clearInterval(intervalId)
	}, [message.created_at, isMounted])

	return isMounted ? (
		<span className='text-xs leading-none text-gray-500'>
			{formattedDate}
		</span>
	) : null
}
