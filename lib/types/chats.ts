import { baseUrl } from '../routes/url'
import { Session } from '@supabase/supabase-js'

// Chat types
export type ChatUser = {
	id: string
	name: string
	image?: string | null
}

export type PostInfo = {
	id: number
	title: string
	status: string
}

export type ChatT = {
	id: number
	created_at: string
	user1: ChatUser
	user2: ChatUser
	post: PostInfo
	user1_read_chat: boolean
	user2_read_chat: boolean
}

export type ChatMessage = {
	chat_id: number | null
	created_at: string
	id: number
	message: string | null
	user_id: string | null
}

type ChatJSONResponse = {
	chats: {
		id: number
		created_at: string
		user1: {
			id: string
			firstName: string
			lastName: string
			image_url?: string | null
		}
		user2: {
			id: string
			firstName: string
			lastName: string
			image_url?: string | null
		}
		post: {
			id: number
			title: string
			status: string
		}
		user1_read_chat: boolean
		user2_read_chat: boolean
	}[]
}

export async function getChats(session: Session | null): Promise<ChatT[]> {
	if (session === null) return []

	const token = session.access_token

	const res = await fetch(`${baseUrl()}/api/chats`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	})
	if (!res.ok) {
		return []
	}
	const data: ChatJSONResponse = await res.json()
	return data.chats.map((chat) => {
		return {
			id: chat.id,
			created_at: chat.created_at,
			user1: {
				id: chat.user1.id,
				name: `${chat.user1.firstName} ${chat.user1.lastName}`,
				image:
					chat.user1.image_url !== null ? chat.user1.image_url : null,
			},
			user2: {
				id: chat.user2.id,
				name: `${chat.user2.firstName} ${chat.user2.lastName}`,
				image:
					chat.user2.image_url !== null ? chat.user2.image_url : null,
			},
			post: {
				id: chat.post.id,
				title: chat.post.title,
				status: chat.post.status,
			},
			user1_read_chat: chat.user1_read_chat,
			user2_read_chat: chat.user2_read_chat,
		}
	})
}
