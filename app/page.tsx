export const dynamic = 'force-dynamic'

import Hero from '@/components/Hero'
import { serverSupabase } from '@/lib/serverSupabase'
import { redirect } from 'next/navigation'

export default async function Home() {
	const supabase = serverSupabase()
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		redirect('/dashboard')
	}

	return (
		<main>
			<Hero />
		</main>
	)
}
