import { serverSupabase } from '@/lib/serverSupabase'
import { NotificationBody } from '@/lib/types/global'
import { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'
// Create a notification for another user
export async function POST(req: NextRequest) {
	const body = await req.json()
	if (!body) {
		return new Response('No body provided', { status: 400 })
	}
	const { kind, message, recipient, sender, href } = body
	if (!kind || !message || !recipient || !sender || !href) {
		return new Response('Missing required fields', { status: 400 })
	}

	const notification: NotificationBody = {
		kind,
		message,
		recipient,
		sender,
		href,
	}

	const supabase = serverSupabase()
	const { error } = await supabase
		.from('notifications')
		.insert([notification])

	if (error) {
		return new Response(error.message, { status: 500 })
	}
	return new Response('Notification sent!', { status: 200 })
}

// Get all users notifications
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
	const { data: notifications, error } = await supabase
		.from('notifications')
		.select('*')
		.eq('recipient', id)
		.order('created_at', { ascending: false })
	if (error) {
		return new Response(error.message, { status: 500 })
	}

	const countUnread = notifications?.filter((n) => !n.viewed).length
	return new Response(JSON.stringify({ notifications, countUnread }), {
		status: 200,
	})
}
