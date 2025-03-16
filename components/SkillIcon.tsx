import { AiFillCar } from 'react-icons/ai'
import { FaBowlFood } from 'react-icons/fa6'
import { FiScissors } from 'react-icons/fi'
import { GiHouse, GiJumpingDog } from 'react-icons/gi'
import { MdBedtime, MdOutlineDirectionsWalk } from 'react-icons/md'
import { TbHealthRecognition } from 'react-icons/tb'
import { FaDog } from 'react-icons/fa'

export default function SkillIcon({
	skill,
	className,
}: {
	skill: string
	className?: string
}) {
	if (skill === 'Pet walking') {
		return <MdOutlineDirectionsWalk className={className} />
	} else if (skill === 'Pet sitting') {
		return <GiHouse className={className} />
	} else if (skill === 'Pet grooming') {
		return <FiScissors className={className} />
	} else if (skill === 'Pet training') {
		return <GiJumpingDog className={className} />
	} else if (skill === 'Pet feeding') {
		return <FaBowlFood className={className} />
	} else if (skill === 'Pet boarding') {
		return <MdBedtime className={className} />
	} else if (skill === 'Pet transport') {
		return <AiFillCar className={className} />
	} else if (skill === 'Pet health care') {
		return <TbHealthRecognition className={className} />
	} else {
		return <FaDog className={className} />
	}
}
