function Pagination({
	currentPage,
	filteredPosts,
	postsPerPage,
	paginate,
}: {
	currentPage: number
	filteredPosts: { length: number }
	postsPerPage: number
	paginate: (pageNumber: number) => void
}) {
	return (
		<div className='flex justify-center mt-4 w-[90%]'>
			{Array.from({
				length: Math.ceil(filteredPosts.length / postsPerPage),
			}).map((temp, index) => (
				<button
					data-iscurrentpage={index + 1 == currentPage}
					key={index}
					onClick={(e) => {
						e.preventDefault()
						paginate(index + 1)
					}}
					className={`px-3 py-2 mx-2 data-[iscurrentpage=true]:bg-neutral-800 data-[iscurrentpage=true]:text-white bg-neutral-200 hover:bg-neutral-500 rounded-full text-bold hover:text-white focus:outline-none`}
				>
					{index + 1}
				</button>
			))}
		</div>
	)
}

export default Pagination
