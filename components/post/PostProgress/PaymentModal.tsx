import { ChangeEvent, useState } from 'react'
import { PostDetails } from '..'
import { Modal } from '../../modals'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/clientSupabase'
import notification from '@/lib/helpers/notification'
import toast from 'react-hot-toast'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Database } from '@/lib/types/supabase'
import { Button } from '@/components/elements'

export function PaymentModal({
	post,
	dismiss,
}: {
	post: PostDetails
	dismiss: () => void
}) {
	const [selectedImage, setSelectedImage] = useState<null | File>(null)
	const [bid, setBid] = useState<
		Database['public']['Tables']['bids']['Row'] | null
	>(null)
	const router = useRouter()
	const { getDetails } = useUserDetails()
	const { firstName, lastName } = getDetails()
	const onDismiss = useCallback(() => {
		if (dismiss) dismiss()
		else {
			router.back()
		}
	}, [dismiss, router])

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === 'Escape') onDismiss()
		},
		[onDismiss]
	)

	useEffect(() => {
		document.addEventListener('keydown', onKeyDown)
		return () => document.removeEventListener('keydown', onKeyDown)
	}, [onKeyDown])

	useEffect(() => {
		const getBid = async () => {
			// Separate fetch to retrieve the amount
			const { data: bidData, error: bidError } = await supabase
				.from('bids')
				.select('*')
				.eq('bidder_id', post.selected_bidder || '')
				.eq('post_id', post.id)
				.single()

			if (bidError) {
				toast.error('Error with retrieving amount')
				return
			}
			setBid(bidData)
		}
		if (!bid) getBid()
	})

	const uploadFile = (event: ChangeEvent<HTMLInputElement>) => {
		if (!event.target.files) {
			toast.error('No file selected')
			return
		}
		// Check if file is of type image
		const file = event.target.files[0]
		if (!file.type.startsWith('image/')) {
			toast.error('File must be an image')
			return
		}
		setSelectedImage(file)
	}

	const makePayment = async () => {
		// Fetch to retrieve post details
		if (!post.selected_bidder) {
			toast.error('No selected bidder')
			return
		}

		if (!selectedImage) {
			toast.error('No image selected')
			return
		}
		// Get image file extension
		const fileExtension = selectedImage.name.split('.').pop()
		// Upload the image
		const { error } = await supabase.storage
			.from('payment_receipts')
			.upload(`${post.id}/receipt.${fileExtension}`, selectedImage, {
				cacheControl: '3600',
				upsert: false,
			})

		if (error) {
			toast.error(error.message)
			return
		}
		const { error: paymentError } = await supabase
			.from('posts')
			.update({ status: 'paid' })
			.eq('id', post.id)
			.select()
			.single()
		if (paymentError) {
			toast.error('Error with payment, try again')
			return
		}

		// Notify the carer
		await notification({
			kind: 'TASK_PAID',
			message: `${firstName} ${lastName} has sent the payment of $${bid?.amount}, for task "${post.title}", for approval. An admin will confirm the details and you will receive your payment shortly`,
			recipient: post.selected_bidder,
			sender: post.owner_id,
			href: `/post/${post.id}`,
		})

		// Create the action
		const { error: actionError } = await supabase.from('actions').insert({
			kind: 'CONFIRM_PAY',
			ref: post.id.toString(),
		})
		if (actionError) {
			toast.error('Error with payment, try again')
			return
		}

		dismiss()
		toast.success('Payment has been made!')
		router.refresh()
	}

	return (
		<Modal close={() => dismiss()}>
			<section>
				<div className=' mx-auto my-4 rounded bg-white text-center'>
					<h1 className='text-2xl font-bold'>Pay: ${bid?.amount}</h1>
					<h2 className='my-4'>
						Upload the payment receipt to be approved by an admin
					</h2>
					{selectedImage && (
						<div className='mb-4 flex w-full flex-col items-center'>
							<img
								alt='not found'
								width={'250px'}
								src={URL.createObjectURL(selectedImage)}
							/>
							<br />
							<Button onClick={() => setSelectedImage(null)}>
								Remove
							</Button>
						</div>
					)}
					<input
						className='mx-auto mb-5 w-full rounded-lg border px-3 py-2 text-lg'
						type='file'
						accept='image/*'
						onChange={(event) => {
							uploadFile(event)
						}}
					></input>
					<Button onClick={() => makePayment()}> Complete </Button>
				</div>
			</section>
		</Modal>
	)
}
