import { serverSupabase } from '@/lib/serverSupabase'

export const dynamic = 'force-dynamic'

// Gets all post data
export async function GET() {
	const supabase = serverSupabase()

	const { data: posts, error } = await supabase
		.from('posts')
		.select(
			'*, owner:users!posts_owner_id_fkey(*), bidder:users!posts_selected_bidder_fkey(*), questions(*), bids(*)'
		)
	if (error) {
		return new Response(error.message, { status: 500 })
	}

	return new Response(JSON.stringify({ posts }), {
		status: 200,
	})
}
