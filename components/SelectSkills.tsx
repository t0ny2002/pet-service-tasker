'use client'

import Loading from '@/components/Loading'
import { supabase } from '@/lib/clientSupabase'
import { categories } from '@/lib/constants'
import { useEffect, useState } from 'react'
import { AiFillCar } from 'react-icons/ai'; // transport icon
import { FaBowlFood } from 'react-icons/fa6'; // feeding icon
import { FiScissors } from 'react-icons/fi'; // pet grooming icon
import { GiHouse, GiJumpingDog } from 'react-icons/gi'; // pet sitting icon
import { MdBedtime, MdOutlineDirectionsWalk } from 'react-icons/md'; // pet walking icon
import { TbHealthRecognition } from 'react-icons/tb'; // pet healthcare icon

export default function SelectSkills({ id }: { id: string }) {
	const [loading, setLoading] = useState(true)
	const [skills, setSkills] = useState<{ [key: string]: boolean }>({})

	// Get the skills of the user.
	useEffect(() => {
		async function fetchUserSkills() {
			const { data, error } = await supabase
				.from('skills')
				.select('*')
				.eq('user', id)

			// Set skills.
			if (data) {
				const newSkills = data.reduce<{ [key: string]: boolean }>(
					(acc, { skill }) => ({ ...acc, [skill]: true }),
					{}
				)
				setSkills(newSkills)
				setLoading(false)
			} else if (error) {
				console.error(error)
			}
		}

		fetchUserSkills()
	}, [id])

	const getIconForSkill = (skillName: string) => {
		if (skillName === 'Pet walking') return <MdOutlineDirectionsWalk />
		else if (skillName === 'Pet sitting') return <GiHouse />
		else if (skillName === 'Pet grooming') return <FiScissors />
		else if (skillName === 'Pet training') return <GiJumpingDog />
		else if (skillName === 'Pet feeding') return <FaBowlFood />
		else if (skillName === 'Pet boarding') return <MdBedtime />
		else if (skillName === 'Pet transport') return <AiFillCar />
		else if (skillName === 'Pet health care') return <TbHealthRecognition />
		else return <Loading />
	}

	const toggleSkill = async (skillName: string, isSelected: boolean) => {
		if (isSelected) {
			// Insert the new skill
			const { error } = await supabase
				.from('skills')
				.insert([{ user: id, skill: skillName }])

			if (error) {
				console.error('Error inserting skill:', error)
				return
			}
		} else {
			// Remove the skill
			const { error } = await supabase
				.from('skills')
				.delete()
				.eq('user', id)
				.eq('skill', skillName)

			if (error) {
				console.error('Error deleting skill:', error)
				return
			}
		}
		setSkills({ ...skills, [skillName]: isSelected })
	}

	if (!loading) {
		return (
			<div className='flex flex-wrap'>
				{categories.map((skillName) => (
					<div
						className='relative flex items-start w-1/2'
						key={skillName}
					>
						<div className='flex h-6 items-center'>
							<input
								id='comments'
								aria-describedby='comments-description'
								name='comments'
								type='checkbox'
								className='h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600'
								checked={
									skills[skillName] === undefined
										? false
										: skills[skillName]
								}
								onChange={(e: {
									target: { checked: boolean }
								}) => toggleSkill(skillName, e.target.checked)}
							/>
						</div>
						<div className='ml-3 text-sm leading-6 flex items-center gap-2'>
							{getIconForSkill(skillName)}
							<label
								htmlFor='comments'
								className='font-medium text-gray-900'
							>
								{skillName}
							</label>{' '}
						</div>
					</div>
				))}
			</div>
		)
	}
}
