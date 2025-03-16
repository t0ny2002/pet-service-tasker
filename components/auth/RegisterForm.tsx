'use client'

import { useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { supabase } from '@/lib/clientSupabase'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Routes } from '@/lib/routes'
import Link from 'next/link'
import { Button, Input } from '../elements'

export function RegisterForm() {
	// const router = useRouter()
	const searchParams = useSearchParams()
	const { setDetails } = useUserDetails()

	const [firstName, setFirstName] = useState({ value: '', error: false })
	const [lastName, setLastName] = useState({ value: '', error: false })
	const [phone, setPhone] = useState({ value: '', error: false })
	const [email, setEmail] = useState({ value: '', error: false })
	const [password, setPassword] = useState({ value: '', error: false })
	const [type, setType] = useState(searchParams.get('type') || 'owner')

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let error = false
		if (firstName.value.length === 0) {
			setFirstName({ ...firstName, error: true })
			error = true
		}
		if (lastName.value.length === 0) {
			setLastName({ ...lastName, error: true })
			error = true
		}
		if (!/^[0-9]{10}$/.test(phone.value)) {
			setPhone({ ...phone, error: true })
			error = true
		}
		if (!/^[^@]+@[^@]+(.[^@]+)+$/.test(email.value)) {
			setEmail({ ...email, error: true })
			error = true
		}
		if (password.value.length < 6) {
			setPassword({ ...password, error: true })
			error = true
		}
		if (error) {
			return
		}

		const {
			error: signUpError,
			data: { user },
		} = await supabase.auth.signUp({
			email: email.value,
			password: password.value,
		})
		if (signUpError) {
			console.error('Failed to register user', signUpError)
			return
		} else if (user !== null && (type === 'owner' || type === 'carer')) {
			setDetails({
				id: user.id,
				firstName: firstName.value,
				lastName: lastName.value,
				bio: '',
				location: '',
				phone: phone.value,
				email: email.value,
				role: type,
			})
		}

		const { error: userRowError } = await supabase.from('users').insert({
			firstName: firstName.value,
			lastName: lastName.value,
			phone: phone.value,
			bio: '',
			role: type,
		})
		if (userRowError) {
			console.error('Failed to add user info', error)
			return
		}

		window.location.replace('/dashboard')
	}

	return (
		<form onSubmit={handleSubmit} className='flex w-full flex-col gap-4'>
			{/* Add LOGO here */}
			<h2 className='mb-2 text-center text-3xl font-bold'>Sign Up</h2>
			<div className='flex w-full flex-col gap-4 md:flex-row'>
				<Input
					id='firstName'
					name='firstName'
					label='First Name'
					value={firstName.value}
					onChange={({ value }) =>
						setFirstName({ value, error: false })
					}
					errorControl={{
						value: firstName.error,
						text: 'Please provide your first name',
					}}
					fullWidth
				/>
				<Input
					id='lastName'
					name='lastName'
					label='Last Name'
					value={lastName.value}
					onChange={({ value }) =>
						setLastName({ value, error: false })
					}
					errorControl={{
						value: lastName.error,
						text: 'Please provide your last name',
					}}
					fullWidth
				/>
			</div>

			<Input
				id='phone'
				name='phone'
				label='Phone Number'
				value={phone.value}
				onChange={({ value }) => setPhone({ value, error: false })}
				errorControl={{
					value: phone.error,
					text: 'Please provide your phone number',
				}}
			/>

			<Input
				id='email'
				name='email'
				label='Email'
				value={email.value}
				onChange={({ value }) => setEmail({ value, error: false })}
				errorControl={{
					value: email.error,
					text: 'Please provide a valid email, eg: jane.smith@example.com',
				}}
			/>

			<Input
				id='password'
				name='password'
				label='Password'
				type='password'
				value={password.value}
				onChange={({ value }) => setPassword({ value, error: false })}
				errorControl={{
					value: password.error,
					text: 'Your password must be at least 6 characters long',
				}}
			/>

			<div className='mt-3 flex rounded-md border-2 border-indigo-600'>
				<button
					type='button'
					data-active={type === 'owner'}
					onClick={() => setType('owner')}
					className='flex flex-1 items-center justify-center rounded-sm rounded-r-md bg-transparent px-4 py-[7px] text-sm font-semibold text-gray-900 data-[active=true]:bg-indigo-600 data-[active=true]:text-white'
				>
					{"I'm a Pet Owner"}
				</button>
				<button
					type='button'
					data-active={type === 'carer'}
					onClick={() => setType('carer')}
					className='flex flex-1 items-center justify-center rounded-sm rounded-l-md bg-transparent px-4 py-[7px] text-sm font-semibold text-gray-900 data-[active=true]:bg-indigo-600 data-[active=true]:text-white'
				>
					{"I'm a Pet Carer"}
				</button>
			</div>

			<div className='mt-3 w-full'>
				<Button type='submit' size='lg' fullWidth>
					Sign Up
				</Button>
			</div>

			<span className='mt-6 text-center text-gray-500'>
				Already have an account?{' '}
				<Link
					href={Routes.login}
					className='text-indigo-600 hover:underline'
				>
					Login
				</Link>
			</span>
		</form>
	)
}
