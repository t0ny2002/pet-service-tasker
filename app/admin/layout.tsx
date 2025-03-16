import { ReactNode } from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Pet Tasker | Admin',
	description: 'Administration of Pet Tasker Site',
}

export const dynamic = 'force-dynamic'

// Admin Layout that ensures the user is an admin
export default async function AdminCheck({
	children,
}: {
	children: ReactNode
}) {
	const supabase = createServerComponentClient<Database>({ cookies })
	const {
		data: { user },
	} = await supabase.auth.getUser()

	if (user) {
		const { data } = await supabase
			.from('users')
			.select('role')
			.eq('id', user.id)
			.single()

		if (data?.role === 'admin') {
			return <>{children}</>
		}
	}

	redirect('/')
}
