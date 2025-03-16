'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { PostDetails } from '.'
import { supabase } from '@/lib/clientSupabase'
import { Button } from '../elements'
import { PostInputs } from './PostInputs'

function formatPostTime(time: string | null) {
	if (time === null) {
		return ''
	}
	const date = new Date(time)
	const localDate = date.toISOString().split('T')[0]
	const localTime = date.toLocaleTimeString()
	return localDate + 'T' + localTime
}

export function EditPost({ post }: { post: PostDetails }) {
	const router = useRouter()

	const [title, setTitle] = useState({ value: post.title, error: false })
	const [selectedImage, setSelectedImage] = useState<null | File>(null)
	const [startTime, setStartTime] = useState({
		value: formatPostTime(post.start_time),
		error: false,
	})
	const [duration, setDuration] = useState({
		value: post.duration,
		error: false,
	})
	const [location, setLocation] = useState({
		value: post.location,
		error: false,
	})
	const [category, setCategory] = useState({
		value: post.category,
		error: false,
	})
	const [description, setDescription] = useState({
		value: post.description,
		error: false,
	})

	const handleSave = async () => {
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
		if (error || !selectedImage) {
			return
		}

		let image_URL = null
		const fileExtension = selectedImage.name.split('.').pop()
		let path = `post/${Math.round(
			10000000 * Math.random()
		)}.${fileExtension}`

		if (post.image_URL) {
			const parts = post.image_URL.split('/')
			path = parts.slice(-2).join('/')
			//Update it
			const { error: imgError } = await supabase.storage
				.from('post_pics')
				.update(path, selectedImage, {
					cacheControl: '3600',
					upsert: true,
				})
			if (imgError) {
				toast.error('Could not update image, try again! ' + path)
				return
			}
		} else {
			const { error: imgError } = await supabase.storage
				.from('post_pics')
				.upload(path, selectedImage, {
					cacheControl: '3600',
					upsert: false,
				})

			if (imgError) {
				toast.error('Could not upload image, try again!')
				return
			}
		}
		const { data: imageData } = await supabase.storage
			.from('post_pics')
			.getPublicUrl(`${path}?${Math.round(10000000 * Math.random())}`)
		if (imageData) {
			image_URL = imageData.publicUrl
		}

		const { error: updateError } = await supabase
			.from('posts')
			.update({
				title: title.value,
				start_time: startTime.value,
				duration: duration.value,
				description: description.value,
				location: location.value,
				category: category.value,
				image_URL: image_URL,
			})
			.eq('id', post.id)

		if (updateError) {
			toast.error('Could not save post, try again!')
			return
		}

		toast.success('Successfully saved details')
		router.back()
		router.refresh()
	}

	const handleDelete = async () => {
		const { error: updateError } = await supabase
			.from('posts')
			.update({ status: 'hidden' })
			.eq('id', post.id)
		if (updateError) {
			toast.error('Could not delete post, try again!')
			return
		}

		toast.success('Post deleted!')
		router.push(`/posts`)
	}

	const handleReopen = async () => {
		const { error: updateError } = await supabase
			.from('posts')
			.update({ status: 'todo' })
			.eq('id', post.id)
		if (updateError) {
			toast.error('Could not reopen post, try again!')
			return
		}

		toast.success('Post reopened!')
		router.push(`/post/${post.id}`)
		router.refresh()
	}

	return (
		<div className='divide-y divide-gray-900/10'>
			<div className='flex flex-col gap-6 pb-10'>
				<div>
					<h2 className='text-xl font-semibold leading-7 text-gray-900'>
						Edit Post
					</h2>
					<p className='mt-1 text-sm leading-6 text-gray-600'>
						Update the details of the post. This information will
						remain public, so {"don't"} include any private
						information.
					</p>
				</div>

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
					imageURL={post.image_URL}
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
					<Button onClick={handleSave} size='lg'>
						Save
					</Button>
				</div>
			</div>

			{post.status === 'todo' && (
				<div className='flex flex-col gap-6 py-10'>
					<div>
						<h2 className='text-xl font-semibold leading-7 text-gray-900'>
							Delete Post
						</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600'>
							No longer need your task to be completed? Delete the
							task to stop it from appearing on the platform.
						</p>
					</div>

					<div className='flex justify-end gap-4'>
						<button
							onClick={handleDelete}
							className='rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600'
						>
							Yes, delete post
						</button>
					</div>
				</div>
			)}

			{post.status === 'hidden' && (
				<div className='flex flex-col gap-6 py-10'>
					<div>
						<h2 className='text-xl font-semibold leading-7 text-gray-900'>
							Reopen Post
						</h2>
						<p className='mt-1 text-sm leading-6 text-gray-600'>
							As an admin, you can reopen this post to be bid on
							again if the owner has requested it. The task will
							return to the open status.
						</p>
					</div>

					<div className='flex justify-end gap-4'>
						<Button onClick={handleReopen} size='lg'>
							Reopen
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
