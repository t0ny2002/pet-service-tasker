import { categories } from '@/lib/constants'
import { FaMapMarkerAlt } from 'react-icons/fa'
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5'
import SkillIcon from './SkillIcon'
import Report from '@/components/Report'

export default function Profile({
	role,
	firstName,
	lastName,
	bio,
	location,
	skills,
	average_rating,
	number_ratings,
	profile_id,
	image_url,
}: {
	role: string
	firstName: string
	lastName: string
	bio: string
	location: string
	skills: { [key: string]: boolean }
	average_rating: number
	number_ratings: number
	profile_id?: string
	image_url?: string | null
}) {
	return (
		<div className='divide-y divide-gray-700/30'>
			<div className='pb-4'>
				<span className='inline-block h-24 w-24 overflow-hidden rounded-full bg-gray-100'>
					{!image_url && (
						<svg
							className='h-full w-full text-gray-300'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
						</svg>
					)}
					{!!image_url && (
						<img
							src={image_url}
							alt='Profile picture'
							className='h-full w-full object-cover'
						/>
					)}
				</span>

				{/* Profile title */}
				<h3 className='mt-4 text-xl'>
					{role === 'carer'
						? 'Carer Profile'
						: role === 'owner'
						? 'Owner Profile'
						: 'Admin Profile'}
				</h3>

				<div className='mb-4 flex flex-row gap-5'>
					{/* User name */}
					<h3 className='text-3xl font-bold'>
						{firstName} {lastName}
					</h3>
					{/* Report User */}
					<Report type='User' ref_id={profile_id} />
				</div>

				{/* Stars */}
				<div className='mb-4 flex items-center'>
					{[...Array(Math.floor(average_rating))].map((_, index) => (
						<IoStar key={index} className='star text-yellow-500' />
					))}

					{average_rating % 1 !== 0 && (
						<IoStarHalf className='star text-yellow-500' />
					)}
					{average_rating < 5 &&
						[...Array(Math.floor(5 - average_rating))].map(
							(_, index) => (
								<IoStarOutline
									key={index}
									className='star text-yellow-500'
								/>
							)
						)}
					{number_ratings !== 0 ? (
						<span className='ml-4 mr-4 mt-0.5'>
							{average_rating.toFixed(1)} out of 5 (
							{number_ratings} reviews)
						</span>
					) : (
						<p className='ml-3 mt-0.5 '>Not yet rated</p>
					)}
				</div>

				{/* Location */}
				<div className='flex items-center'>
					<FaMapMarkerAlt className='mr-2' />
					<span className='ml-2'>{location}</span>
				</div>
			</div>

			<div className='py-4'>
				{/* User bio */}
				<h2 className='mb-2 text-2xl font-bold'>About {firstName}</h2>
				<div className='mb-4 w-full break-words'>{bio}</div>

				{/* User skills (if a carer) */}
				{role !== 'admin' && (
					<>
						<h2 className='mb-2 text-2xl font-bold'>Skills</h2>
						{Object.keys(skills).length > 0 ? (
							<div className='flex flex-wrap'>
								{categories.map(
									(skillName, index) =>
										skills[skillName] && (
											<div
												key={index}
												style={{ flex: '0 0 50%' }}
											>
												<span className='inline-flex items-center'>
													<SkillIcon
														skill={skillName}
													/>
													<span className='ml-2'>
														{skillName}
													</span>
												</span>
											</div>
										)
								)}
							</div>
						) : (
							<div>No skills shown</div>
						)}
					</>
				)}
			</div>
		</div>
	)
}
