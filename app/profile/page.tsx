export const dynamic = 'force-dynamic'

import Profile from '@/components/Profile'
import { serverSupabase } from '@/lib/serverSupabase'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ProfilePage() {
	const supabase = serverSupabase()
	const {
		data: { user: current_user },
	} = await supabase.auth.getUser()
	if (!current_user) {
		notFound()
	}

	// If there is a logged-in user, fetch their info from Supabase
	const { data, error } = await supabase
		.from('users')
		.select('firstName, lastName, bio, location, role, image_url')
		.eq('id', current_user.id)
		.single()
	const { data: skillData, error: skillError } = await supabase
		.from('skills')
		.select('*')
		.eq('user', current_user.id)
	if (error || skillError) {
		notFound()
	}

	const { data: rating } = await supabase
		.from('average_rating')
		.select('*')
		.eq('rated_id', current_user.id)
		.single()

	let average_rating = 0
	let number_rating = 0
	if (rating) {
		average_rating = rating.average_rating || 0
		number_rating = rating.number_ratings || 0
	}

	// If user data was available, set their values
	const bio = data.bio || 'This user has not written a bio.'
	const location = data.location || 'Unknown'
	const skills: { [key: string]: boolean } = skillData.reduce(
		(acc, { skill }) => ({ ...acc, [skill]: true }),
		{}
	)
	console.log(data)

	return (
		<main className='mx-auto flex w-full max-w-screen-md flex-col p-6 sm:p-10'>
			{/* Profile image and name */}
			<Profile
				role={data.role}
				firstName={data.firstName}
				lastName={data.lastName}
				bio={bio}
				location={location}
				skills={skills}
				average_rating={average_rating}
				number_ratings={number_rating}
				image_url={data.image_url}
			/>

			{/* Button to edit profile */}
			<Link
				href='/profile/edit'
				className='flex w-full justify-center rounded-md bg-black px-4 py-[5px] text-white'
			>
				Edit Profile
			</Link>
		</main>
	)
}
