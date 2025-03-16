import { notFound } from 'next/navigation'
import Rating from '@/components/Rating'
import toast from 'react-hot-toast'
import { serverSupabase } from '@/lib/serverSupabase'

export const dynamic = 'force-dynamic'

export default async function rateProfile({
	params: { id },
}: {
	params: { id: string }
}) {
	const supabase = serverSupabase()

	const {
		data: { user: currentUser },
	} = await supabase.auth.getUser()

	if (!currentUser) {
		notFound()
	}

	const { data, error } = await supabase
		.from('users')
		.select('firstName, lastName, role')
		.eq('id', id)
		.single()

	if (error) {
		console.log(error)
		toast.error('Error with retrieving user')
		return
	}
	// Check if it's been rated here.

	const { data: rating } = await supabase
		.from('ratings')
		.select('*')
		.eq('rater_id', currentUser.id)
		.eq('rated_id', id)

	const has_rating = rating?.length !== 0 ? true : false
	// Ratings
	return (
		<Rating
			rated_id={id}
			rater_id={currentUser.id}
			firstName={data.firstName}
			lastName={data.lastName}
			role={data.role}
			has_rating={has_rating}
		/>
	)
}
