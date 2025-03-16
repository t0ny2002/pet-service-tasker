'use client'

import { useState } from 'react'

import { AiOutlineStar, AiFillStar } from 'react-icons/ai'
import { supabase } from '@/lib/clientSupabase'

import toast from 'react-hot-toast'

export default function Rating({
	rater_id,
	rated_id,
	firstName,
	lastName,
	role,
	has_rating,
}: {
	rater_id: string
	rated_id: string
	firstName: string
	lastName: string
	role: string
	has_rating: boolean
}) {
	// Ratings

	const [rating, setRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	// const [rated, setRated] = useState(false)

	const handleRating = async () => {
		if (!rating) {
			return
		}
		const { error } = await supabase.from('ratings').insert([
			{
				rated_id: rated_id,
				rater_id: rater_id,
				rating: rating,
			},
		])

		if (error) {
			console.log(error)
			toast.error('Error with rating carer')
			return
		}
		toast.success('Successfully rated carer')
		// I want to go to the home page after rating
		window.location.replace('/')
		setRating(0)
	}

	return has_rating ? (
		<p className='flex items-center text-lg justify-center mt-14'>
			You have already rated {role} {firstName} {lastName}
		</p>
	) : (
		<div className='flex items-center flex-col'>
			<p className='mt-5'>
				Click below to rate {role} {firstName} {lastName}
			</p>
			<div className='flex flex-row mt-6'>
				{[1, 2, 3, 4, 5].map((totalStars) => (
					<button
						key={totalStars}
						className='mx-1'
						onClick={() => setRating(totalStars)}
						onMouseOver={() => setHoverRating(totalStars)}
					>
						{totalStars <= (rating || hoverRating) ? (
							<AiFillStar className='text-2xl' />
						) : (
							<AiOutlineStar className='text-2xl' />
						)}
					</button>
				))}
			</div>
			<button
				className='py-3 rounded bg-black text-white px-14 mt-6'
				onClick={handleRating}
			>
				Submit Rating
			</button>
		</div>
	)
}
