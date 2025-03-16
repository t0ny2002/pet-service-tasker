import { ReactNode } from 'react'
import Link from 'next/link'
import { classNames } from '@/lib/helpers/simple'

interface ButtonProps {
	type?: 'button' | 'submit' | 'link'
	href?: string
	kind?: 'primary' | 'secondary'
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
	fullWidth?: boolean

	children: ReactNode

	onClick?: () => void
}

/**
 * Button element
 *
 * If `type = 'link'`, `href` is used instead of `onClick`
 *
 * By default:
 *  - `type = 'button'`
 *  - `href = '/'`
 *  - `kind = 'primary'`
 *  - `size = 'md'`
 *  - `fullWidth = false`
 */
export function Button({
	type = 'button',
	href = '/',
	kind = 'primary',
	size = 'md',
	fullWidth = false,
	children,
	onClick = () => {},
}: ButtonProps) {
	const sizeClasses = {
		xs: 'rounded px-2 py-1 text-xs',
		sm: 'rounded px-2 py-1 text-sm',
		md: 'rounded-md px-2.5 py-1.5 text-sm',
		lg: 'rounded-md px-3 py-2 text-sm',
		xl: 'rounded-md px-3.5 py-2.5 text-sm',
	}
	const classes = classNames(
		'font-semibold shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
		sizeClasses[size],
		kind === 'primary'
			? 'bg-indigo-600 text-white hover:bg-indigo-500'
			: 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
		fullWidth ? 'w-full' : ''
	)

	if (type === 'link') {
		return (
			<Link href={href} className={classes}>
				{children}
			</Link>
		)
	}

	return (
		<button type={type} className={classes} onClick={onClick}>
			{children}
		</button>
	)
}
