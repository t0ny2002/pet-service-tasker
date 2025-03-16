'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/lib/types/supabase'

export function AdminInviteForm() {
	const router = useRouter()
	const supabase = createClientComponentClient<Database>()

	const [email, setEmail] = useState('')

	const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		const { data, error } = await supabase
			.from('admin_invites')
			.insert({ invitee_email: email })
			.select('id')
			.single()
		if (error) {
			toast.error('Error inviting admin email, try again')
			return
		}
		// Opens the user's email client with a pre-filled email
		const registerLink = `${window.location.origin}/admin-register/${data.id}`
		const emailHref = `mailto:${email}?subject=${encodeURIComponent(
			'Pet Tasker Admin Invite'
		)}&body=${encodeURIComponent(
			`You've been invited as an admin! Sign up with this link:\n\n${registerLink}`
		)}`

		const mailLink = document.createElement('a')
		mailLink.href = emailHref
		mailLink.click()

		toast.success('Admin invite sent!')
		setEmail('')
		router.back()
	}

	return (
		<form className='flex flex-col gap-4 w-full' onSubmit={submitHandler}>
			<h2 className='text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight'>
				Invite New Admin
			</h2>
			<p className='text-gray-700'>
				Send an invite to a new email to let them register as an admin
				of the platform. Once registered, they will have full admin
				abilities on the Pet Tasker platform.
			</p>

			<div>
				<label
					htmlFor='email'
					className='block text-sm font-medium leading-6 text-gray-900'
				>
					Email
				</label>
				<div className='mt-2'>
					<input
						type='email'
						name='email'
						id='email'
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className='block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
						placeholder='admin@pettasker.com'
						required
					/>
				</div>
			</div>

			<button
				type='submit'
				className='flex w-full justify-center rounded-md bg-indigo-600 mt-2 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
			>
				Send Email Invite
			</button>
		</form>
	)
}
