'use client'

import { SyntheticEvent, useState } from 'react'

import { supabase } from '@/lib/clientSupabase'

import toast from 'react-hot-toast'
import { IoWarningOutline } from 'react-icons/io5'
import { AiFillCloseCircle } from 'react-icons/ai'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { FlagIcon } from '@heroicons/react/24/outline'
import { Modal } from './modals'
import { Button } from './elements'

export default function Report({
	type,
	ref_id,
}: {
	type: string
	ref_id?: string
}) {
	const { getDetails } = useUserDetails()
	const { id } = getDetails()
	const [showReportForm, setShowReportForm] = useState(false)

	const [message, setMessage] = useState({ value: '', error: false })

	function toggleReport() {
		setShowReportForm(!showReportForm)
		setMessage({ value: '', error: false })
		return
	}

	const handleSubmit = async (
		e: SyntheticEvent<HTMLFormElement, SubmitEvent>
	) => {
		e.preventDefault()

		if (message.value.length == 0) {
			setMessage({ ...message, error: true })
			return
		}

		const action_kind =
			type === 'User'
				? 'REPORT_USER'
				: type === 'Post'
				? 'REPORT_POST'
				: type === 'Bid'
				? 'REPORT_BID'
				: 'REPORT_OTHER'

		const { error } = await supabase.from('actions').insert({
			kind: action_kind,
			ref: ref_id,
			user_ref: id,
			status: 'todo',
			message: message.value,
		})
		if (error) {
			console.error('Error Submitting Report:', error)
			return
		}
		toast.success('Report Submitted')
		setShowReportForm(false)
	}

	return (
		ref_id && (
			<>
				<button
					onClick={toggleReport}
					className='group rounded-lg p-1 hover:bg-orange-400'
				>
					<FlagIcon className='h-5 w-5 group-hover:text-white' />
				</button>
				{showReportForm && (
					<Modal close={() => setShowReportForm(false)}>
						<div className='min-w-[300px]'>
							<button
								className='absolute right-4 top-4'
								onClick={toggleReport}
							>
								<AiFillCloseCircle />
							</button>
							<IoWarningOutline
								size={24}
								color='red'
								className='mx-auto'
							/>
							<h3 className='mb-2 text-center text-lg font-semibold text-red-500'>
								Report
								{type === 'User'
									? ' User'
									: type === 'Post'
									? ' Post'
									: type === 'Bid'
									? ' Bid'
									: ' Item'}
							</h3>
							<form
								className='flex flex-col'
								onSubmit={handleSubmit}
							>
								<label className='my-2 font-semibold'>
									Tell us what&apos;s wrong
								</label>
								<textarea
									name='message'
									className='w-full data-[error=true]:border-red-500'
									value={message.value}
									onChange={(e) =>
										setMessage({
											value: e.target.value,
											error: false,
										})
									}
									data-error={message.error}
								></textarea>
								<span
									data-error={message.error}
									className='hidden text-xs text-red-500 data-[error=true]:inline'
								>
									You must provide context!
								</span>
								<div className='mt-3 flex justify-end gap-2'>
									<Button
										kind='secondary'
										onClick={toggleReport}
									>
										Cancel
									</Button>
									<Button type='submit'>Report</Button>
								</div>
							</form>
						</div>
					</Modal>
				)}
			</>
		)
	)
}
