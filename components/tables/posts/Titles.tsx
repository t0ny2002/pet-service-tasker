export function PostTitles() {
	return (
		<thead>
			<tr>
				<th
					scope='col'
					className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
				>
					Title
				</th>
				<th
					scope='col'
					className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell'
				>
					Owner
				</th>
				<th
					scope='col'
					className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
				>
					Category
				</th>
				<th
					scope='col'
					className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
				>
					Status
				</th>
				<th
					scope='col'
					className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell xl:hidden'
				>
					Details
				</th>
				<th
					scope='col'
					className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell'
				>
					Location
				</th>
				<th
					scope='col'
					className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 xl:table-cell'
				>
					Start Time
				</th>
				<th scope='col' className='relative py-3.5 pl-3 pr-4 sm:pr-0'>
					<span className='sr-only'>Edit</span>
				</th>
			</tr>
		</thead>
	)
}
