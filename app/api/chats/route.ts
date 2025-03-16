import { serverSupabase } from '@/lib/serverSupabase'
import { NextRequest } from 'next/server'

// Get's a users chats
export async function GET(req: NextRequest) {
	const authHeader = req.headers.get('Authorization') || ''
	const token = authHeader?.split(' ')[1]
	const supabase = serverSupabase()
	const {
		data: { user },
	} = await supabase.auth.getUser(token)

	if (!user) {
		return new Response('User not found', { status: 404 })
	}

	const { id } = user
	const { data: chats, error } = await supabase
		.from('chats')
		.select(
			'*, user1:users!chats_user1_id_fkey(*), user2:users!chats_user2_id_fkey(*), post:posts!chats_post_id_fkey(*)'
		)
		.or(`user1_id.eq.${id}, user2_id.eq.${id}`)
		.order('created_at', { ascending: false })
	if (error) {
		return new Response(error.message, { status: 500 })
	}

	return new Response(JSON.stringify({ chats }), {
		status: 200,
	})
}
