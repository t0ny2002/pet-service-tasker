'use client'

import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useState } from 'react'
import toast from 'react-hot-toast'

import SelectSkills from '@/components/SelectSkills'
import { supabase } from '@/lib/clientSupabase'
import useUserDetails from '@/lib/hooks/useUserDetails'

export default function EditProfile({
	id,
	role,
	defaults,
}: {
	id: string
	role: string
	defaults: {
		firstName: string
		lastName: string
		bio: string
		location: string
		image_url: string
	}
}) {
	const router = useRouter()

	const { getDetails } = useUserDetails()
	const { role: editorRole } = getDetails()

	const [firstName, setFirstName] = useState({
		value: defaults.firstName,
		error: false,
	})
	const [lastName, setLastName] = useState({
		value: defaults.lastName,
		error: false,
	})
	const [bio, setBio] = useState({ value: defaults.bio, error: false })
	const [location, setLocation] = useState({
		value: defaults.location,
		error: false,
	})

	const [selectedImage, setSelectedImage] = useState<null | File>(null)

	const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return
		}
		const file = e.target.files[0]
		setSelectedImage(file)
	}
	// Handle Save Details button
	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		// Check for errors
		let error = false
		if (firstName.value.length === 0) {
			setFirstName({ ...firstName, error: true })
			error = true
		}
		if (lastName.value.length === 0) {
			setLastName({ ...lastName, error: true })
			error = true
		}
		if (error) {
			return
		}

		let image_URL = null
		if (selectedImage !== null) {
			const fileExtension = selectedImage.name.split('.').pop()
			const path = `${Math.round(
				10000000 * Math.random()
			)}.${fileExtension}`
			const { error: imgError } = await supabase.storage
				.from('users')
				.upload(path, selectedImage, {
					cacheControl: '3600',
					upsert: false,
				})

			if (imgError) {
				console.log(imgError)
				toast.error('Could not upload file, try again.')
				return
			}

			const { data: imageData } = await supabase.storage
				.from('users')
				.getPublicUrl(path)
			if (imageData) {
				image_URL = imageData.publicUrl
			}
		}

		// If no errors, update user table with new values
		const { error: updateError } = await supabase
			.from('users')
			.update({
				firstName: firstName.value,
				lastName: lastName.value,
				bio: bio.value,
				location: location.value,
				image_url: image_URL,
			})
			.eq('id', id)
		if (updateError) {
			toast.error(updateError.message)
			return
		}

		// Show success message
		toast.success('Changes saved!')
		router.replace(editorRole === 'admin' ? `/profile/${id}` : '/profile')
    router.refresh()
	}

	return (
		<>
			<h1 className='mb-4 text-center text-2xl font-bold'>
				Edit Profile
			</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-4'>
				<label className='mb-3 mt-5 flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white p-4 shadow-md transition duration-300 hover:border-blue-500'>
					<span className='text-gray-600'>
						Upload a profile picture{' '}
					</span>
					<input
						type='file'
						accept='image/*'
						className='hidden'
						onChange={(e) => handleFileUpload(e)}
					/>
				</label>
				<div className='flex items-center justify-center'>
					{' '}
					{(selectedImage || defaults.image_url) && (
						<>
							<h1 className='mr-4 text-lg font-bold'>Preview</h1>
							<img
								alt='not found'
								src={
									selectedImage
										? URL.createObjectURL(selectedImage)
										: defaults.image_url
								}
								className='h-40 w-40 rounded-full'
							/>
						</>
					)}
				</div>
				<div
					data-error={firstName.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='First Name' className='text-sm font-bold'>
						First Name
					</label>
					<input
						type='First Name'
						id='First Name'
						name='First Name'
						value={firstName.value}
						onChange={(e) =>
							setFirstName({
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
						You must provide a first name.
					</span>
				</div>

				<div
					data-error={lastName.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='Last Name' className='text-sm font-bold'>
						Last Name
					</label>
					<input
						type='Last Name'
						id='Last Name'
						name='Last Name'
						value={lastName.value}
						onChange={(e) =>
							setLastName({
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
						You must provide a last name.
					</span>
				</div>

				<div
					data-error={location.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='Location' className='text-sm font-bold'>
						Location
					</label>
					<input
						type='Location'
						id='Location'
						name='Location'
						value={location.value}
						onChange={(e) =>
							setLocation({
								value: e.target.value,
								error: false,
							})
						}
						data-error={location.error}
						className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
					/>
					<span
						data-error={location.error}
						className='hidden text-xs data-[error=true]:inline'
					>
						You must provide a location.
					</span>
				</div>

				<div
					data-error={bio.error}
					className='flex flex-1 flex-col data-[error=true]:text-red-500'
				>
					<label htmlFor='Bio' className='text-sm font-bold'>
						Bio
					</label>
					<textarea
						id='Bio'
						name='Bio'
						value={bio.value}
						onChange={(e) =>
							setBio({
								value: e.target.value,
								error: false,
							})
						}
						data-error={bio.error}
						className='rounded-md border border-black px-2 py-1 text-black data-[error=true]:border-red-500'
						rows={4} // Set the number of rows to 4
					/>
					<span
						data-error={bio.error}
						className='hidden text-xs data-[error=true]:inline'
					>
						You must provide a biography.
					</span>
				</div>

				{/* Select Skills */}
				{role === 'carer' && (
					<div>
						<label htmlFor='Skills' className='text-sm font-bold'>
							Skills
						</label>
						<SelectSkills id={id} />
					</div>
				)}

				{/* Save Details button*/}
				<button
					type='submit'
					className='mt-5 flex justify-center rounded-md bg-black px-4 py-[5px] text-white'
				>
					Save
				</button>
			</form>
		</>
	)
}
