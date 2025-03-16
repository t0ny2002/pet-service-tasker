import Link from 'next/link'

export async function Count({
	title,
	count,
	href,
}: {
	title: string
	count: number | null
	href?: string
}) {
	return (
		<div className='h-fit overflow-hidden rounded-lg bg-white px-4 py-5 shadow-md ring-1 ring-inset ring-gray-200 sm:p-6'>
			<dt className='truncate text-sm font-medium text-gray-500'>
				{title}
			</dt>
			<dd className='mt-1 text-3xl font-semibold tracking-tight text-gray-900'>
				{count || '-'}
				{href && (
					<Link
						href={href}
						className='ml-2 text-sm font-normal tracking-normal text-indigo-600 hover:underline'
					>
						View
					</Link>
				)}
			</dd>
		</div>
	)
}
