import { PostDetails } from '..'
import { Modal } from '../../modals'
import { useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { supabase } from '@/lib/clientSupabase'
import toast from 'react-hot-toast'
import notification from '@/lib/helpers/notification'
import { Button } from '@/components/elements'

export function ConfirmTaskFinishedModal({
	dismiss,
	post,
}: {
	dismiss: () => void
	post: PostDetails
}) {
	const router = useRouter()
	const { firstName, lastName } = useUserDetails().getDetails()

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

	const finishTask = async () => {
		const { error: completionError } = await supabase
			.from('posts')
			.update({ status: 'done' })
			.eq('id', post.id)
			.select()
			.single()
		if (completionError) {
			toast.error('Error with completing the task')
			return
		}

		// Notify the owner
		await notification({
			kind: 'TASK_COMPLETE',
			message: `${firstName} ${lastName} has marked your task: ${post?.title}, as completed!`,
			recipient: post.owner_id,
			sender: post.selected_bidder || '',
			href: `/post/${post.id}`,
		})

		// Notify the owner to rate the carer
		await notification({
			kind: 'RATE_CARER',
			message: `${firstName} ${lastName} has recently completed your task, ${post?.title}! Submit a rating of them so other pet owners know what you think of ${firstName}!`,
			recipient: post.owner_id,
			sender: post.selected_bidder || '',
			href: `/profile/${post.selected_bidder || ''}/rate`,
		})

		// Notify the carer to rate the owner
		await notification({
			kind: 'RATE_OWNER',
			// Has to be the same as the owner one, but with different variables
			message: `You recently completed the task ${post?.title}, rate the owner. Submit a rating of them to let other pet carers know what you think of them!`,
			recipient: post.selected_bidder || '',
			sender: post.owner_id,
			href: `/profile/${post.owner_id}/rate`,
		})
		dismiss()
		toast.success('Task completed!')
		router.refresh()
	}

	return (
		<Modal close={() => dismiss()}>
			<section>
				<div className='mx-auto my-4 rounded bg-white text-center'>
					<h2 className='my-4'>
						Are you sure you want to confirm the task has been
						finished?
					</h2>
					<Button onClick={() => finishTask()}>
						Confirm Finished
					</Button>
				</div>
			</section>
		</Modal>
	)
}
