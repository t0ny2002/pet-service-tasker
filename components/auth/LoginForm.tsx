'use client'

import { FormEvent, useState } from 'react'

import { supabase } from '@/lib/clientSupabase'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Routes } from '@/lib/routes'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { Button, Input } from '../elements'

export default function LoginForm() {
	const { setDetailsAsync } = useUserDetails()

	const [email, setEmail] = useState({ value: '', error: false })
	const [password, setPassword] = useState({ value: '', error: false })

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let error = false
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
		} = await supabase.auth.signInWithPassword({
			email: email.value,
			password: password.value,
		})
		if (signUpError) {
			toast.error(`Failed to register user ${signUpError.message}`)
			return
		} else if (user !== null) {
			await setDetailsAsync()
		}

		window.location.replace('/dashboard')
	}

	return (
		<form onSubmit={handleSubmit} className='flex w-full flex-col gap-4'>
			<h2 className='mb-2 text-center text-3xl font-bold'>Sign In</h2>

			<Input
				id='email'
				name='email'
				label='Email'
				value={email.value}
				onChange={({ value }) => setEmail({ value, error: false })}
				errorControl={{
					value: email.error,
					text: 'Please enter a valid email',
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
					text: 'Please enter your password',
				}}
			/>

			<div className='mt-3 w-full'>
				<Button type='submit' size='lg' fullWidth>
					Sign In
				</Button>
			</div>

			<span className='mt-6 text-center text-gray-500'>
				Don&rsquo;t have an account?{' '}
				<Link
					href={Routes.signup}
					className='text-indigo-600 hover:underline'
				>
					Sign up
				</Link>
			</span>
		</form>
	)
}
