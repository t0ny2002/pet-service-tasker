'use client'

import { PostDetails } from '..'
import { useState } from 'react'
import { ConfirmTaskFinishedModal } from './ConfirmTaskFinishedModal'
import { PaymentModal } from './PaymentModal'
import { InformationCircleIcon } from '@heroicons/react/20/solid'

interface Props {
	id: string
	role: string
	post: PostDetails
}

export default function PostProgress({ post, role, id }: Props) {
	const [taskModal, setTaskModal] = useState(false)
	const [paymentModal, setPaymentModal] = useState(false)

	const chooseBidder = id === post.owner_id && post.status === 'todo'

	const readyToComplete =
		role === 'carer' &&
		post.selected_bidder === id &&
		post.status == 'progress'

	const postSendPayment =
		role == 'owner' && post.owner_id == id && post.status == 'done'

	const carerAwaitingPay =
		role === 'carer' && (post.status === 'done' || post.status === 'paid')

	if (
		!chooseBidder &&
		!readyToComplete &&
		!postSendPayment &&
		!carerAwaitingPay
	) {
		return <></>
	}

	return (
		<>
			<div className='mb-6 rounded-md bg-yellow-50 p-4'>
				<div className='flex'>
					<div className='flex-shrink-0'>
						<InformationCircleIcon className='h-5 w-5 text-yellow-400' />
					</div>
					<div className='ml-3'>
						<h3 className='text-sm font-medium text-yellow-800'>
							{chooseBidder
								? 'Choose a bidder'
								: readyToComplete
								? 'Finished the task?'
								: postSendPayment
								? 'Pay your tasker'
								: 'Your pay is on the way'}
						</h3>
						<div className='mt-2 flex-1 text-sm text-yellow-700 md:flex md:justify-between'>
							<p>
								{chooseBidder
									? "In order to progress with your task you'll need to select a bidder. Head to the Bids tab below to select your prefered carer."
									: readyToComplete
									? "Once you've finished the task you need to mark it as complete. This will let the owner send payment for approval."
									: postSendPayment
									? 'The carer you selected has marked the task as complete. Please send payment and upload a photo of the transaction to have it approved by a site admin.'
									: 'You have completed this task! The owner should send payment to you shortly.'}
							</p>
							{(readyToComplete || postSendPayment) && (
								<p className='mt-3 text-sm md:ml-6 md:mt-0'>
									<button
										onClick={() => {
											if (readyToComplete)
												setTaskModal(true)
											else setPaymentModal(true)
										}}
										className='whitespace-nowrap font-medium text-yellow-700 hover:text-yellow-600'
									>
										{readyToComplete
											? 'Mark Complete'
											: 'Make Payment'}
									</button>
								</p>
							)}
						</div>
					</div>
				</div>
				{taskModal && (
					<ConfirmTaskFinishedModal
						dismiss={() => setTaskModal(false)}
						post={post}
					/>
				)}
				{/* Payment Modal if button is clicked */}
				{paymentModal && (
					<PaymentModal
						post={post}
						dismiss={() => setPaymentModal(false)}
					/>
				)}
			</div>
		</>
	)
}
