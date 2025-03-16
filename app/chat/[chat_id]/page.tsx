import RealtimeChatPage from '../realtime-chat'
import { serverSupabase } from '@/lib/serverSupabase'

export default async function ViewChatPage({
	params,
}: {
	params: { chat_id: number }
}) {
	const supabase = serverSupabase()

	// Fetch messages.
	const { data: messages, error: messagesError } = await supabase
		.from('messages')
		.select('*')
		.eq('chat_id', params.chat_id)
		.order('created_at', { ascending: true })

	if (messagesError) {
		console.error(messagesError)
	}

	// Fetch chat info.
	const { data: chatInfo, error: chatError } = await supabase
		.from('chats')
		.select('id, created_at, user1_id, user2_id, post_id')
		.eq('id', params.chat_id)
		.single()

	if (chatError) {
		console.error(chatError)
	}

	// Fetch post info.
	let postInfo = null
	if (chatInfo && chatInfo.post_id) {
		const response = await supabase
			.from('posts')
			.select('*')
			.eq('id', chatInfo.post_id)
			.single()

		postInfo = response.data
	}

	return (
		<main className='flex h-[calc(100%-64px)] w-full flex-col items-center bg-gray-100 text-gray-800 md:p-10'>
			<div className='flex w-full max-w-xl flex-grow flex-col overflow-hidden rounded-lg bg-white shadow-xl'>
				{chatInfo ? (
					<RealtimeChatPage
						serverMessages={messages ?? []}
						chatInfo={chatInfo}
						postInfo={postInfo}
					/>
				) : (
					<p>Loading...</p>
				)}
			</div>
		</main>
	)
}
