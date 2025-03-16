'use client'

import { supabase } from '@/lib/clientSupabase'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { useRouter } from 'next/navigation'
import { ReactNode } from 'react'
import toast from 'react-hot-toast'

export default function Logout({
	children,
	className = '',
}: {
	children: ReactNode
	className?: string
}) {
	const router = useRouter()
	const { resetDetails } = useUserDetails()

	const handleLogout = async () => {
		const { error } = await supabase.auth.signOut()
		resetDetails()
		if (error) toast.error(`Error logging out: ${error.message}`)
		router.push('/')
	}

	return (
		<div onClick={handleLogout} className={className}>
			{children}
		</div>
	)
}
