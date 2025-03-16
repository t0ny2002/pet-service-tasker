export async function Percentage({
	title,
	support,
	count,
}: {
	title: string
	support?: string
	count: number | null
}) {
	return (
		<div className='h-fit overflow-hidden rounded-lg bg-white px-4 py-5 shadow-md ring-1 ring-inset ring-gray-200 sm:p-6'>
			<dt className='truncate text-sm font-medium text-gray-500'>
				{title}
			</dt>
			<dd className='mt-1 text-3xl font-semibold tracking-tight text-gray-900'>
				{count ? (count * 100).toFixed(2) : '-'}%
			</dd>
			{support && (
				<span className='text-xs font-light text-gray-700'>
					{support}
				</span>
			)}
		</div>
	)
}
