'use client'

import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import {
	adminPages,
	carerPages,
	loggedOutPages,
	ownerPages,
} from '@/lib/constants'
import { classNames } from '@/lib/helpers/simple'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Routes } from '@/lib/routes'
import Logout from '../auth/Logout'
import Notifications from './Notifications'
import UserNav from './userNav'

export default function Navbar() {
	const pathname = usePathname()
	const { getDetails } = useUserDetails()
	const userDetails = getDetails()

	const [mounted, setMounted] = useState(false)
	const pages = useMemo(() => {
		switch (userDetails.role) {
			case 'carer':
				return carerPages
			case 'owner':
				return ownerPages
			case 'admin':
				return adminPages
			default:
				return loggedOutPages
		}
	}, [userDetails])

	useEffect(() => {
		setMounted(true)
	}, [])

	// This is somewhat cursed.
	// Better solution would be to move pages that need navbar into their own
	// page group and put the navbar into a layout there
	if (pathname.startsWith('/admin-register/')) {
		return <></>
	}

	return (
		<Disclosure as='nav' className='bg-white shadow-sm'>
			{({ open }) => (
				<>
					<div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
						<div className='flex h-16 justify-between'>
							<div className='flex'>
								<Link
									href='/'
									className='flex flex-shrink-0 items-center'
								>
									<img
										className='h-8 w-auto scale-[1.25]'
										src='/logo.png'
										alt='Pet Tasker'
									/>
								</Link>
								<div className='hidden sm:-my-px sm:ml-6 sm:flex sm:space-x-8'>
									{mounted &&
										pages.map((item) => (
											<Link
												key={item.name}
												href={item.href}
												className={classNames(
													pathname === item.href
														? 'border-indigo-500 text-gray-900'
														: 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
													'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
												)}
											>
												{item.name}
											</Link>
										))}
								</div>
							</div>
							<div className='hidden gap-2 sm:ml-6 sm:flex sm:items-center'>
								{/* Login button */}
								{mounted && !userDetails.id && (
									<Link
										href={Routes.login}
										className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
									>
										Login
									</Link>
								)}
								{/* Notification button */}
								{mounted && !!userDetails.id && (
									<Notifications />
								)}
								{/* Profile dropdown */}
								{mounted && <UserNav />}
							</div>
							<div className='-mr-2 flex items-center sm:hidden'>
								{/* Login button */}
								{mounted && !userDetails.id && (
									<Link
										href={Routes.login}
										className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
									>
										Login
									</Link>
								)}
								{/* Mobile menu button */}
								<Disclosure.Button className='relative inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'>
									<span className='absolute -inset-0.5' />
									<span className='sr-only'>
										Open main menu
									</span>
									{open ? (
										<XMarkIcon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									) : (
										<Bars3Icon
											className='block h-6 w-6'
											aria-hidden='true'
										/>
									)}
								</Disclosure.Button>
							</div>
						</div>
					</div>

					<Disclosure.Panel className='sm:hidden'>
						<div className='space-y-1 pb-3 pt-2'>
							{pages.map((item) => (
								<Disclosure.Button
									key={item.name}
									as='a'
									href={item.href}
									className={classNames(
										pathname === item.href
											? 'border-indigo-500 bg-indigo-50 text-indigo-700'
											: 'border-transparent text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800',
										'block border-l-4 py-2 pl-3 pr-4 text-base font-medium'
									)}
								>
									{item.name}
								</Disclosure.Button>
							))}
						</div>
						<div className='border-t border-gray-200 pb-3 pt-4'>
							{!!userDetails.id && (
								<div className='flex items-center px-4'>
									<div>
										<div className='text-base font-medium text-gray-800'>
											{userDetails.firstName}{' '}
											{userDetails.lastName}
										</div>
										<div className='text-sm font-medium text-gray-500'>
											{userDetails.email}
										</div>
									</div>
									<Notifications className='ml-auto' />
								</div>
							)}
							<div className='mt-3 space-y-1'>
								{!!userDetails.id && (
									<Disclosure.Button
										as='button'
										className='block w-full text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
									>
										<Logout className='px-4 py-2 text-left'>
											Logout
										</Logout>
									</Disclosure.Button>
								)}
								{!userDetails.id && (
									<>
										<Disclosure.Button
											as='a'
											href={Routes.login}
											className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
										>
											Login
										</Disclosure.Button>
										<Disclosure.Button
											as='a'
											href={Routes.signup}
											className='block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800'
										>
											Sign up
										</Disclosure.Button>
									</>
								)}
							</div>
						</div>
					</Disclosure.Panel>
				</>
			)}
		</Disclosure>
	)
}
