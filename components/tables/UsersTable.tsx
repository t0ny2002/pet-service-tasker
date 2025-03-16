'use client'

import { MagnifyingGlassIcon, UsersIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react'

export type UserRow = {
	id: string
	name: string
	role: string
	email: string
	image_url: string
}
type Role = 'All' | 'Admins' | 'Owners' | 'Carers'

const roleFilter = (role: Role) => {
	if (role === 'All') {
		return () => true
	} else if (role === 'Admins') {
		return (user: UserRow) => user.role === 'Admin'
	} else if (role === 'Owners') {
		return (user: UserRow) => user.role === 'Owner'
	}
	return (user: UserRow) => user.role === 'Carer'
}

export function UsersTable({ users }: { users: UserRow[] }) {
	const router = useRouter()
	const params = useSearchParams()

	const [filtered, setFiltered] = useState<UserRow[]>(users)

	const [search, setSearch] = useState('')
	const [role, setRole] = useState<Role>('All')

	const updateParams = (search: string, role: Role) => {
		if (role === 'All' && search === '') {
			router.replace('/admin/users')
		} else if (role === 'All') {
			router.replace(`/admin/users?search=${search}`)
		} else if (search === '') {
			router.replace(`/admin/users?role=${role}`)
		} else {
			router.replace(`/admin/users?search=${search}&role=${role}`)
		}
	}

	const onSubmit = async (e?: FormEvent<HTMLFormElement>) => {
		if (e) e.preventDefault()
		updateParams(search, role)
	}

	const onChangeRole = (e: ChangeEvent<HTMLSelectElement>) => {
		const updateRole = e.target.value
		if (
			updateRole === 'All' ||
			updateRole === 'Admins' ||
			updateRole === 'Owners' ||
			updateRole === 'Carers'
		) {
			setRole(updateRole)
			updateParams(search, updateRole)
		}
	}

	useEffect(() => {
		const searchParam = params.get('search')
		const roleParam = params.get('role')
		let filterdUsers = users
		if (searchParam !== null && searchParam !== '') {
			setSearch(searchParam)
			filterdUsers = users.filter(
				(user) =>
					user.email
						.toLowerCase()
						.includes(searchParam.toLowerCase()) ||
					user.name.toLowerCase().includes(searchParam.toLowerCase())
			)
		}
		if (roleParam !== null && roleParam !== '') {
			if (
				roleParam === 'All' ||
				roleParam === 'Admins' ||
				roleParam === 'Owners' ||
				roleParam === 'Carers'
			) {
				setRole(roleParam)
				filterdUsers = filterdUsers.filter(roleFilter(roleParam))
			}
		}
		setFiltered(filterdUsers)
	}, [users, params])

	return (
		<>
			<div className='mt-6 flex gap-3 flex-col md:flex-row'>
				{/* Search Filter */}
				<div className='flex-1'>
					<label
						htmlFor='search'
						className='block text-sm font-medium leading-6 text-gray-900'
					>
						Search users ({filtered.length})
					</label>
					<form
						onSubmit={onSubmit}
						className='mt-2 flex rounded-md shadow-sm'
					>
						<div className='relative flex flex-grow items-stretch focus-within:z-10'>
							<div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3'>
								<UsersIcon
									className='h-5 w-5 text-gray-400'
									aria-hidden='true'
								/>
							</div>
							<input
								type='text'
								name='search'
								id='search'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								className='block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
								placeholder='Bob User'
							/>
						</div>
						<button
							type='button'
							onClick={() => onSubmit()}
							className='relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
						>
							<MagnifyingGlassIcon
								className='-ml-0.5 h-5 w-5 text-gray-400'
								aria-hidden='true'
							/>
							Search
						</button>
					</form>
				</div>

				{/* Select Role Filter */}
				<div>
					<label
						htmlFor='location'
						className='block text-sm font-medium leading-6 text-gray-900'
					>
						Role
					</label>
					<select
						id='location'
						name='location'
						className='mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6'
						value={role}
						onChange={onChangeRole}
					>
						<option>All</option>
						<option>Admins</option>
						<option>Owners</option>
						<option>Carers</option>
					</select>
				</div>
			</div>

			{/* User Table */}
			<div className='mt-2 flow-root'>
				<div className='-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8'>
					<div className='inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8'>
						<table className='min-w-full divide-y divide-gray-300'>
							<thead>
								<tr>
									<th
										scope='col'
										className='py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0'
									>
										Name
									</th>
									<th
										scope='col'
										className='hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 md:table-cell'
									>
										Email
									</th>
									<th
										scope='col'
										className='px-3 py-3.5 text-left text-sm font-semibold text-gray-900'
									>
										Role
									</th>
									<th
										scope='col'
										className='relative py-3.5 pl-3 pr-4 sm:pr-0'
									>
										<span className='sr-only'>Edit</span>
									</th>
								</tr>
							</thead>
							<tbody className='divide-y divide-gray-200 bg-white'>
								{filtered.map((user) => (
									<tr key={user.email}>
										<td className='whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0'>
											<div className='flex items-center'>
												<span className='inline-block h-10 w-10 overflow-hidden rounded-full bg-gray-100'>
													<svg
														className='h-full w-full text-gray-300'
														fill='currentColor'
														viewBox='0 0 24 24'
													>
														<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
													</svg>
												</span>
												<div className='ml-4'>
													<div className='font-medium text-gray-900'>
														{user.name}
													</div>
													<div className='mt-1 text-xs text-gray-500 md:hidden'>
														{user.email}
													</div>
												</div>
											</div>
										</td>
										<td className='hidden px-3 py-4 text-sm text-gray-500 md:table-cell'>
											{user.email}
										</td>
										<td className='whitespace-nowrap px-3 py-4 text-sm text-gray-500'>
											{user.role}
										</td>
										<td className='relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0'>
											{user.role !== 'Admin' && (
												<Link
													href={`/profile/${user.id}/edit`}
													className='text-indigo-600 hover:text-indigo-900'
												>
													Edit
													<span className='sr-only'>
														, {user.name}
													</span>
												</Link>
											)}
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</>
	)
}
