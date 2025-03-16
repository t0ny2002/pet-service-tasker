'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

import { supabase } from '@/lib/clientSupabase'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Routes } from '@/lib/routes'
import Link from 'next/link'
import toast from 'react-hot-toast'

export function AdminRegisterForm({ token }: { token: string }) {
	const router = useRouter()
	const { setDetails } = useUserDetails()

	const [firstName, setFirstname] = useState({ value: '', error: false })
	const [lastName, setLastname] = useState({ value: '', error: false })
	const [phone, setPhone] = useState({ value: '', error: false })
	const [email, setEmail] = useState({ value: '', error: false })
	const [password, setPassword] = useState({ value: '', error: false })

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let error = false
		if (firstName.value.length === 0) {
			setFirstname({ ...firstName, error: true })
			error = true
		}
		if (lastName.value.length === 0) {
			setLastname({ ...lastName, error: true })
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

		const { data, error: inviteError } = await supabase
			.from('admin_invites')
			.select('invitee_email,used')
			.eq('id', token)
			.single()
		if (inviteError) {
			toast.error('Invite could not be found!')
			return
		}
		if (data.invitee_email !== email.value) {
			toast.error('Email does not match invite')
			return
		}
		if (data.used) {
			toast.error('This token has expired')
			return
		}

		const { error: invalidateTokenError } = await supabase
			.from('admin_invites')
			.update({ used: true })
			.eq('id', token)
		if (invalidateTokenError) {
			toast.error('Unable to use token, try again')
			return
		}

		const {
			data: { user },
			error: signUpError,
		} = await supabase.auth.signUp({
			email: email.value,
			password: password.value,
		})
		if (signUpError) {
			toast.error('Failed to register user: ' + signUpError.message)
			return
		} else if (user !== null) {
			setDetails({
				id: user.id,
				firstName: firstName.value,
				lastName: lastName.value,
				bio: '',
				location: '',
				phone: phone.value,
				email: email.value,
				role: 'admin',
			})
		}

		const { error: userRowError } = await supabase.from('users').insert({
			firstName: firstName.value,
			lastName: lastName.value,
			bio: '',
			role: 'admin',
		})
		if (userRowError) {
			toast.error('Failed to add user info: ' + userRowError)
			return
		}

		router.push('/admin')
	}

	return (
		<form onSubmit={handleSubmit} className='flex w-full flex-col gap-4'>
			<h2 className='mb-4 text-center text-3xl font-bold'>
				Admin Register
			</h2>
			<div className='flex w-full flex-col gap-4 md:flex-row'>
				<div
					data-error={firstName.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='firstName' className='text-sm'>
						First Name
					</label>
					<input
						type='text'
						id='firstName'
						name='firstName'
						value={firstName.value}
						onChange={(e) =>
							setFirstname({
								value: e.target.value,
								error: false,
							})
						}
						data-error={firstName.error}
						className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
					/>
					<span
						data-error={firstName.error}
						className='hidden text-xs data-[error=true]:inline'
					>
						You must provide a first name
					</span>
				</div>

				<div
					data-error={lastName.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='lastName' className='text-sm'>
						Last Name
					</label>
					<input
						type='text'
						id='lastName'
						name='lastName'
						value={lastName.value}
						onChange={(e) =>
							setLastname({
								value: e.target.value,
								error: false,
							})
						}
						data-error={lastName.error}
						className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
					/>
					<span
						data-error={lastName.error}
						className='hidden text-xs data-[error=true]:inline'
					>
						You must provide a last name
					</span>
				</div>
			</div>

			<div
				data-error={phone.error}
				className='flex flex-col data-[error=true]:text-red-500'
			>
				<label htmlFor='phone' className='text-sm'>
					Phone
				</label>
				<input
					type='tel'
					id='phone'
					name='phone'
					value={phone.value}
					onChange={(e) =>
						setPhone({ value: e.target.value, error: false })
					}
					data-error={phone.error}
					className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
				/>
				<span
					data-error={phone.error}
					className='hidden text-xs data-[error=true]:inline'
				>
					You must provide a phone number, eg: 0412555678
				</span>
			</div>

			<div
				data-error={email.error}
				className='flex flex-col data-[error=true]:text-red-500'
			>
				<label htmlFor='email' className='text-sm'>
					Email
				</label>
				<input
					type='text'
					id='email'
					name='email'
					value={email.value}
					onChange={(e) =>
						setEmail({ value: e.target.value, error: false })
					}
					data-error={email.error}
					className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
				/>
				<span
					data-error={email.error}
					className='hidden text-xs data-[error=true]:inline'
				>
					You must provide an email, eg: jane.smith@example.com
				</span>
			</div>

			<div
				data-error={password.error}
				className='flex flex-col data-[error=true]:text-red-500'
			>
				<label htmlFor='password' className='text-sm'>
					Password
				</label>
				<input
					type='password'
					id='password'
					name='password'
					value={password.value}
					onChange={(e) =>
						setPassword({ value: e.target.value, error: false })
					}
					data-error={password.error}
					className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
				/>
				<span
					data-error={password.error}
					className='hidden text-xs data-[error=true]:inline'
				>
					Your password must be at least 6 characters long
				</span>
			</div>

			<button
				type='submit'
				className='mt-5 flex justify-center rounded-md bg-black px-4 py-[5px] text-white'
			>
				Sign Up
			</button>

			<span className='mt-10 text-center'>
				Already have an account?{' '}
				<Link
					href={Routes.login}
					onClick={() => router.push(Routes.login)}
					className='underline'
				>
					Login
				</Link>
			</span>
		</form>
	)
}
