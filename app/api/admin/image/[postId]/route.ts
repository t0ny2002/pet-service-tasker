import { getUserDetails } from '@/lib/helpers/userServer'
import { Database } from '@/lib/types/supabase'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Create a signed url for the bank receipt and return it (it will expire after 10 minutes)
export async function GET(req: NextRequest, {
	params,
}: {
	params: { postId: number }
}) {
	const authHeader = req.headers.get('Authorization') || ''
	const token = authHeader?.split(' ')[1]

  // Check if there is a user
	const supabase = createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_KEY || '')
	const {
		data: { user },
	} = await supabase.auth.getUser(token)

	if (!user) {
		return new Response('User not found', { status: 404 })
	}
  
  // Check if they are an admin
  const userDetails = await getUserDetails(user.id)
  if (!userDetails) {
    return new Response('User not found', { status: 404 })
  }
  if (userDetails.role !== 'admin') {
    return new Response('Unauthorized', { status: 401 })
  }

  const { postId } = params
  // Find file name (we know the name but not the extension)
	const { data, error } = await supabase
    .storage
    .from('payment_receipts')
		.list(postId.toString())
	if (error) {
		return new Response(error.message, { status: 500 })
	}

  if (data.length === 0) {
    return new Response('No data found', { status: 404 })
  }
  const file = data[0].name
  
  // Create a signed url for the file name and return it (it will expire after 10 minutes)
  const { data: signedURLData, error: signedURLError } = await supabase
    .storage
    .from('payment_receipts')
    .createSignedUrl(`${postId}/${file}`, 600)

  if (signedURLError) {
    return new Response(signedURLError.message, { status: 500 })
  }
  if (!signedURLData) {
    return new Response('No data found', { status: 404 })
  }

	return new Response(signedURLData.signedUrl, { status: 200 })
}
