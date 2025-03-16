import { Dispatch, SetStateAction } from 'react'
import { PostBid } from '..'
import { Modal } from '../../modals'

export function ConfirmBidderModal({
	selectedBid,
	setSelectedBid,
	handleSelectBidder,
}: {
	selectedBid: PostBid | null
	setSelectedBid: Dispatch<SetStateAction<PostBid | null>>
	handleSelectBidder: () => void
}) {
	if (!selectedBid) {
		return <></>
	}

	return (
		<Modal close={() => setSelectedBid(null)}>
			<div className='flex flex-col gap-y-4 text-gray-900'>
				<h2 className='text-xl font-bold'>Confirm Carer Selection</h2>
				<p className='-mt-3'>
					Are you sure you want {selectedBid.bidder_firstName}{' '}
					{selectedBid.bidder_lastName} to complete your task? After
					confirming, you will be able to message{' '}
					{selectedBid.bidder_firstName} to keep each other updated.
					Once they complete the task, you will owe{' '}
					{selectedBid.bidder_firstName}, ${selectedBid.amount}.
				</p>
				<div className='flex justify-end'>
					<button
						className='inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'
						onClick={() => setSelectedBid(null)}
					>
						Cancel
					</button>
					<button
						className='ml-3 inline-flex justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500'
						onClick={handleSelectBidder}
					>
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	)
}
