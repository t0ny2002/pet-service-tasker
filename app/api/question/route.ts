import { getUserDetails } from '@/lib/helpers/userServer'
import { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export async function DELETE(req: NextRequest) {
	const authHeader = req.headers.get('Authorization') || ''
	const token = authHeader?.split(' ')[1]
	const body = await req.json()
  const { question } = body
  if (!question) {
    return new Response('Missing question', { status: 400 })
  }

	const {
		data: { user },
	} = await supabase.auth.getUser(token)
	if (!user) {
		return new Response('User not found', { status: 404 })
	}

  const userDetails = await getUserDetails(user.id)

  if (userDetails?.role === 'admin') {
    const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question)
    if (error) {
      return new Response(error.message, { status: 500 })
    }
  } else {
    const { error } = await supabase
        .from('questions')
        .delete()
        .eq('id', question)
        .eq('asking_user', user.id)
    if (error) {
      return new Response(error.message, { status: 500 })
    }
  }
	return new Response('Notifications marked as read!', { status: 200 })
}
