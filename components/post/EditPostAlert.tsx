import { InformationCircleIcon } from '@heroicons/react/20/solid'
import Link from 'next/link'

export function EditPostAlert({ id }: { id: number }) {
	return (
		<div className='-mt-6 mb-12 rounded-md bg-blue-50 p-4'>
			<div className='flex'>
				<div className='flex-shrink-0'>
					<InformationCircleIcon
						className='h-5 w-5 text-blue-400'
						aria-hidden='true'
					/>
				</div>
				<div className='ml-3 flex-1 md:flex md:justify-between'>
					<p className='text-sm text-blue-700'>
						Need to update the post details?
					</p>
					<p className='mt-3 text-sm md:ml-6 md:mt-0'>
						<Link
							href={`/post/${id}/edit`}
							className='whitespace-nowrap font-medium text-blue-700 hover:text-blue-600'
						>
							Edit Post
							<span aria-hidden='true'> &rarr;</span>
						</Link>
					</p>
				</div>
			</div>
		</div>
	)
}
