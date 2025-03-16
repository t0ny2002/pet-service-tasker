import { statusDetails } from '@/lib/helpers/posts'
import { classNames } from '@/lib/helpers/simple'

export function PostStatusPill({ status }: { status: string }) {
	const { colour, text } = statusDetails(status)

	return (
		<span
			className={classNames(
				'inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset',
				colour
			)}
		>
			{text}
		</span>
	)
}
