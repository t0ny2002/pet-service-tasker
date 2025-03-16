'use client'
import { FaUpload } from 'react-icons/fa6'

export default function UploadPicture({
	handleFileUpload,
}: {
	handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
	return (
		<div className='flex justify-center'>
			<label className='mb-3 flex cursor-pointer items-center justify-center rounded-lg border border-gray-300 bg-white p-2 shadow-md transition duration-300 hover:border-indigo-500 md:p-4'>
				<span className='flex items-center text-gray-600'>
					Upload Picture
					<FaUpload size={20} className='ml-4' />
				</span>
				<input
					type='file'
					accept='image/*'
					className='hidden'
					onChange={(e) => handleFileUpload(e)}
				/>
			</label>
		</div>
	)
}
