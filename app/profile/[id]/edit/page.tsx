export const dynamic = 'force-dynamic'

import EditProfile from '@/components/EditProfile'
import { serverSupabase } from '@/lib/serverSupabase'
import { notFound } from 'next/navigation'

export default async function AdminEditProfilePage({
	params: { id },
}: {
	params: { id: string }
}) {

	const supabase = serverSupabase()
	// Get the logged-in user
	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser()
	if (!currentUser) {
		notFound()
	}
	const { data: currentUserRole, error: currentUserError } = await supabase
		.from('users')
		.select('role')
		.eq('id', currentUser.id)
		.single()
	// If not an admin, no access to page
	if (currentUserError || currentUserRole.role !== 'admin') {
		notFound()
	}

	// Get the users current data
	const { data, error } = await supabase
		.from('users')
		.select('firstName, lastName, bio, location, role, image_url')
		.eq('id', id)
		.single()
	if (error) {
		notFound()
	}

	return (
		<main className='mx-auto flex w-full max-w-screen-md flex-col p-6 sm:p-10'>
			<EditProfile
				id={id}
				role={data.role}
				defaults={{
					firstName: data.firstName,
					lastName: data.lastName,
					location: data.location || '',
					bio: data.bio,
					image_url: data.image_url || '',
				}}
			/>
		</main>
	)
}
