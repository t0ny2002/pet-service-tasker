'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

import { supabase } from '@/lib/clientSupabase'
import { Button } from '../elements'
import { PostInputs } from './PostInputs'

export function CreatePostForm({ uid }: { uid: string }) {
	const router = useRouter()

	const [title, setTitle] = useState({ value: '', error: false })
	const [startTime, setStartTime] = useState({ value: '', error: false })
	const [duration, setDuration] = useState({ value: '', error: false })
	const [location, setLocation] = useState({ value: '', error: false })
	const [category, setCategory] = useState({
		value: 'Pet walking',
		error: false,
	})
	const [description, setDescription] = useState({ value: '', error: false })
	const [selectedImage, setSelectedImage] = useState<null | File>(null)

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		let error = false
		if (description.value.length === 0) {
			setDescription({ ...description, error: true })
			error = true
		}
		if (location.value.length === 0) {
			setLocation({ ...location, error: true })
			error = true
		}
		if (duration.value.length === 0) {
			setDuration({ ...duration, error: true })
			error = true
		}
		if (category.value.length === 0) {
			setCategory({ ...category, error: true })
			error = true
		}
		if (title.value.length === 0) {
			setTitle({ ...title, error: true })
			error = true
		}
		if (startTime.value.length === 0) {
			setStartTime({ ...startTime, error: true })
			error = true
		}
		if (error) {
			return
		}

		let image_URL = null
		if (selectedImage !== null) {
			const fileExtension = selectedImage.name.split('.').pop()
			const path = `post/${Math.round(
				10000000 * Math.random()
			)}.${fileExtension}`
			const { error: imgError } = await supabase.storage
				.from('post_pics')
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
				.from('post_pics')
				.getPublicUrl(path)
			if (imageData) {
				image_URL = imageData.publicUrl
			}
		}

		const { data, error: insertError } = await supabase
			.from('posts')
			.insert({
				category: category.value,
				description: description.value,
				duration: duration.value,
				location: location.value,
				owner_id: uid,
				start_time: startTime.value,
				title: title.value,
				image_URL: image_URL,
			})
			.select()
			.single()
		if (insertError) {
			toast.error('Could not create post, try again.')
			return
		}
		toast.success('Task Posted')

		router.push(`/post/${data.id}`)
	}

	return (
		<>
			<h2 className='text-xl font-semibold leading-7 text-gray-900'>
				Create a post
			</h2>
			<p className='mb-6 mt-1 text-sm leading-6 text-gray-600'>
				Share some details about the task you need done for your pet!
				This information will be public so {"don't"} share more than
				necessary.
			</p>

			<form onSubmit={handleSubmit} className='flex flex-col gap-6'>
				<PostInputs
					title={title}
					setTitle={setTitle}
					startTime={startTime}
					setStartTime={setStartTime}
					duration={duration}
					setDuration={setDuration}
					location={location}
					setLocation={setLocation}
					category={category}
					setCategory={setCategory}
					description={description}
					setDescription={setDescription}
					selectedImage={selectedImage}
					setSelectedImage={setSelectedImage}
					extraDetails
				/>

				<div className='flex justify-end gap-4'>
					<Button
						type='button'
						onClick={() => router.back()}
						kind='secondary'
						size='lg'
					>
						Cancel
					</Button>
					<Button type='submit' size='lg'>
						Post Task
					</Button>
				</div>
			</form>
		</>
	)
}
