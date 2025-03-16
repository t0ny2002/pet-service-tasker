'use client'

import { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { categories } from '@/lib/constants'
import { classNames } from '@/lib/helpers/simple'
import { Input } from '../elements'
import UploadPicture from './UploadPicture'
import toast from 'react-hot-toast'

type ValueError = { value: string; error: boolean }
type SetValueError = Dispatch<SetStateAction<ValueError>>
interface PostInputsProps {
	title: ValueError
	setTitle: SetValueError
	startTime: ValueError
	setStartTime: SetValueError
	duration: ValueError
	setDuration: SetValueError
	location: ValueError
	setLocation: SetValueError
	category: ValueError
	setCategory: SetValueError
	description: ValueError
	setDescription: SetValueError
	extraDetails?: boolean
	selectedImage: File | null
	setSelectedImage: Dispatch<SetStateAction<File | null>>
	imageURL?: string | null
}

export function PostInputs({
	title,
	setTitle,
	startTime,
	setStartTime,
	duration,
	setDuration,
	location,
	setLocation,
	category,
	setCategory,
	description,
	setDescription,
	extraDetails = false,
	selectedImage,
	setSelectedImage,
	imageURL,
}: PostInputsProps) {
	const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
		if (!e.target.files) {
			return
		}

		const file = e.target.files[0]
		if (!file.type.startsWith('image/')) {
			toast.error('File must be an image')
			return
		}
		setSelectedImage(file)
	}
	return (
		<>
			<Input
				id='post-title'
				name='post-title'
				label='Title'
				value={title.value}
				onChange={({ value }) => setTitle({ value, error: false })}
				errorControl={{
					value: title.error,
					text: 'Please provide a short title',
				}}
			/>
			{extraDetails && !title.error && (
				<p className='mt-[-22px] text-xs leading-6 text-gray-600'>
					Provide a short title to quickly let others know what your
					task is.
				</p>
			)}

			<div
				data-error={startTime.error}
				className='flex flex-1 flex-col data-[error=true]:text-red-500'
			>
				<label
					htmlFor='startTime'
					className='mb-1 block text-sm font-medium leading-6 text-gray-900'
				>
					Start Time
				</label>
				<input
					type='datetime-local'
					id='startTime'
					name='startTime'
					value={startTime.value}
					min={new Date().toISOString()}
					max={new Date(
						new Date().getTime() + 1000 * 60 * 60 * 24 * 52
					).toISOString()}
					onChange={(e) =>
						setStartTime({
							value: e.target.value,
							error: false,
						})
					}
					data-error={startTime.error}
					className={classNames(
						'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
						'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
						'data-[error=true]:text-red-900 data-[error=true]:ring-red-500'
					)}
				/>
				{startTime.error && (
					<span className='text-xs text-red-600'>
						You must provide a start time
					</span>
				)}
			</div>

			<Input
				id='post-duration'
				name='post-duration'
				label='Duration of Task'
				value={duration.value}
				onChange={({ value }) => setDuration({ value, error: false })}
				errorControl={{
					value: duration.error,
					text: 'Please provide a task duration',
				}}
			/>
			{extraDetails && !duration.error && (
				<p className='mt-[-22px] text-xs leading-6 text-gray-600'>
					Let others know how long the task will take, or if it is a
					recurring task.
				</p>
			)}

			<Input
				id='post-location'
				name='post-location'
				label='Location (Suburb)'
				value={location.value}
				onChange={({ value }) => setLocation({ value, error: false })}
				errorControl={{
					value: location.error,
					text: 'Please provide an estimate location',
				}}
			/>

			<div
				data-error={category.error}
				className='flex flex-1 flex-col data-[error=true]:text-red-500'
			>
				<label
					htmlFor='category'
					className='mb-1 block text-sm font-medium leading-6 text-gray-900'
				>
					Category
				</label>
				<select
					id='category'
					name='category'
					value={category.value}
					onChange={(e) =>
						setCategory({
							value: e.target.value,
							error: false,
						})
					}
					data-error={category.error}
					className={classNames(
						'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
						'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
						'data-[error=true]:text-red-900 data-[error=true]:ring-red-500'
					)}
				>
					{categories.map((category) => (
						<option key={category} value={category}>
							{category}
						</option>
					))}
				</select>
				<span
					data-error={category.error}
					className='hidden text-xs data-[error=true]:inline'
				>
					You must provide a category
				</span>
			</div>

			<Input
				id='post-description'
				name='post-description'
				type='textarea'
				label='Description'
				value={description.value}
				onChange={({ value }) =>
					setDescription({ value, error: false })
				}
				errorControl={{
					value: description.error,
					text: 'Please provide a description',
				}}
			/>
			{!description.error && (
				<p className='mt-[-22px] text-xs leading-6 text-gray-600'>
					Provide a detailed description of the task that needs to be
					done, including details about your pet!
				</p>
			)}

			{/* Edit Image */}
			<p className='mb-[-20px] block text-sm font-medium leading-6 text-gray-900'>
				Image
			</p>
			{selectedImage ? (
				<img
					alt='not found'
					src={URL.createObjectURL(selectedImage)}
					className='rounded object-cover'
				/>
			) : imageURL ? (
				<img
					src={imageURL}
					alt='Post Image'
					className='rounded object-cover'
				/>
			) : (
				<div></div>
			)}
			<UploadPicture handleFileUpload={handleFileUpload}></UploadPicture>
		</>
	)
}
