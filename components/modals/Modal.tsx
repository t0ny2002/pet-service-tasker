import { ReactNode } from 'react'

export function Modal({
	children,
	close,
}: {
	children: ReactNode
	close: () => void
}) {
	return (
		<div
			className='fixed bottom-0 left-0 right-0 top-0 z-20 mx-auto flex items-center justify-center overflow-y-auto bg-black/60'
			onClick={() => close()}
		>
			<div
				onClick={(e) => e.stopPropagation()}
				className='m-4 sm:my-auto sm:h-fit sm:max-w-lg sm:py-10 md:max-w-2xl'
			>
				<div className='flex flex-col gap-y-4 rounded-lg bg-white p-6 text-gray-900'>
					{children}
				</div>
			</div>
		</div>
	)
}
