'use client'

import { useRouter } from 'next/navigation'
import { MouseEventHandler, useCallback, useEffect, useRef } from 'react'

export function PageModal({
	children,
}: {
	children: React.ReactNode
	dismiss?: () => void
}) {
	const overlay = useRef(null)
	const wrapper = useRef(null)
	const router = useRouter()

	const onDismiss = useCallback(() => {
		router.back()
	}, [router])

	const onClick: MouseEventHandler = (e) => {
		if (e.target === overlay.current || e.target === wrapper.current) {
			if (onDismiss) onDismiss()
		}
	}

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') onDismiss()
		}
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onDismiss])

	return (
		<div
			ref={overlay}
			className='fixed bottom-0 left-0 right-0 top-0 z-20 mx-auto flex items-center justify-center overflow-y-auto bg-white sm:bg-black/60'
			onClick={onClick}
		>
			<div
				ref={wrapper}
				className='h-full w-full sm:my-auto sm:h-fit sm:max-w-lg sm:py-10 md:max-w-2xl'
			>
				{children}
			</div>
		</div>
	)
}
