import { Icon } from '@/lib/types/global'
import {
	AiOutlineDashboard,
	AiOutlineHome,
	AiOutlineUser,
} from 'react-icons/ai'
import { BiNote } from 'react-icons/bi'
import { TbReportMoney } from 'react-icons/tb'

export default function Icon({
	icon,
	className,
}: {
	icon: Icon
	className: string
}): JSX.Element {
	switch (icon) {
		case 'home':
			return <AiOutlineHome className={className} />
		case 'dashboard':
			return <AiOutlineDashboard className={className} />
		case 'person':
			return <AiOutlineUser className={className} />
		case 'post':
			return <BiNote className={className} />
		case 'bid':
			return <TbReportMoney className={className} />
		default:
			return <></>
	}
}
