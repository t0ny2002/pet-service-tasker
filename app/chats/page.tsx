import ChatList from '@/components/chats/ChatList'
import { getChats } from '@/lib/types/chats'
import { serverSupabase } from '@/lib/serverSupabase'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Chats() {
	const supabase = serverSupabase()
	const {
		data: { session },
		error,
	} = await supabase.auth.getSession()

	if (error) {
		notFound()
	}

	const chats = await getChats(session)

	// if the status of the post is paid or complete, remove the chat
	// and remove all associated messages
	chats.map(async (chat) => {
		if (chat.post.status === 'paid' || chat.post.status === 'complete') {
			const { error } = await supabase
				.from('chats')
				.delete()
				.eq('id', chat.id)

			if (error) {
				console.error(error)
			}

			const { error: messageError } = await supabase
				.from('messages')
				.delete()
				.eq('chat_id', chat.id)

			if (messageError) {
				console.error(messageError)
			}
		}
	})

	const activeChats = chats.filter(
		(chat) => chat.post.status !== 'paid' && chat.post.status !== 'complete'
	)

	return (
		<main className='mx-auto w-full max-w-screen-md pt-6 sm:pt-10'>
			<h2 className='text-center text-3xl font-bold text-indigo-500'>
				Messages
			</h2>
			<ChatList chats={activeChats} />
		</main>
	)
}
