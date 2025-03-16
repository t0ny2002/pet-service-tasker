'use client'

import { Fragment } from 'react'
import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'

import { classNames } from '@/lib/helpers/simple'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Routes } from '@/lib/routes'
import Icon from '@/components/Icon'
import Logout from '@/components/auth/Logout'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

export default function UserNav() {
	const { getDetails } = useUserDetails()
	const { id, firstName, lastName } = getDetails()
	return (
		<Menu as='div' className='relative'>
			<Menu.Button className='-m-1.5 flex items-center p-1.5'>
				<span className='sr-only'>Open user menu</span>
				<Icon icon='person' className='h-6 w-6 text-gray-400' />
				<span className='hidden lg:flex lg:items-center'>
					<span className='ml-4 text-sm font-semibold leading-6 text-gray-900'>
						{firstName} {lastName}
					</span>
					<ChevronDownIcon
						className='ml-2 h-5 w-5 text-gray-400'
						aria-hidden='true'
					/>
				</span>
			</Menu.Button>
			<Transition
				as={Fragment}
				enter='transition ease-out duration-100'
				enterFrom='transform opacity-0 scale-95'
				enterTo='transform opacity-100 scale-100'
				leave='transition ease-in duration-75'
				leaveFrom='transform opacity-100 scale-100'
				leaveTo='transform opacity-0 scale-95'
			>
				<Menu.Items className='absolute right-0 z-10 mt-2.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none'>
					{!!id && (
						<Menu.Item>
							{({ active }) => (
								<button
									className={classNames(
										active ? 'bg-gray-50' : '',
										'block w-full text-sm leading-6 text-gray-900'
									)}
								>
									<Logout className='px-3 py-1 text-left'>
										Logout
									</Logout>
								</button>
							)}
						</Menu.Item>
					)}
					{!id && (
						<>
							<Menu.Item>
								{({ active }) => (
									<Link
										href={Routes.login}
										className={classNames(
											active ? 'bg-gray-50' : '',
											'block px-3 py-1 text-sm leading-6 text-gray-900'
										)}
									>
										Login
									</Link>
								)}
							</Menu.Item>
							<Menu.Item>
								{({ active }) => (
									<Link
										href={Routes.signup}
										className={classNames(
											active ? 'bg-gray-50' : '',
											'block px-3 py-1 text-sm leading-6 text-gray-900'
										)}
									>
										Sign up
									</Link>
								)}
							</Menu.Item>
						</>
					)}
				</Menu.Items>
			</Transition>
		</Menu>
	)
}
