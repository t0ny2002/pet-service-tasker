import { serverSupabase } from '@/lib/serverSupabase'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
// Read all notifications
export async function PUT(req: NextRequest) {
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
	const { error } = await supabase
		.from('notifications')
		.update({ viewed: true })
		.eq('recipient', id)
	if (error) {
		return new Response(error.message, { status: 500 })
	}
	return new Response('Notifications marked as read!', { status: 200 })
}
