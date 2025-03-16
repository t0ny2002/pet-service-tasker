'use client'
import { supabase } from '@/lib/clientSupabase'
import { SyntheticEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { PostDetails, PostQuestion } from '..'
import { UserDetails } from '@/lib/helpers/userServer'
import { useRouter } from 'next/navigation'
import notification from '@/lib/helpers/notification'
import {
	HeartIcon as Heart,
	PaperAirplaneIcon,
	TrashIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as LikedHeart } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function Question({
	question,
	post,
	user,
}: {
	question: PostQuestion
	post: PostDetails
	user: UserDetails | null
}) {
	const router = useRouter()

	const [liked, setLiked] = useState(question.liked)
	const [likes, setLikes] = useState(question.likes)
	const [reply, setReply] = useState('')

	const [asker, setAsker] = useState<{
		name: string
		image_url: string | null
	} | null>()
	const [owner, setOwner] = useState<{
		name: string
		image_url: string | null
	} | null>()

	useEffect(() => {
		const fetchUsers = async () => {
			const { data: owner } = await supabase
				.from('users')
				.select('firstName, lastName, image_url')
				.eq('id', post.owner_id)
				.single()
			setOwner(
				owner && {
					name: owner.firstName + ' ' + owner.lastName,
					image_url: owner.image_url,
				}
			)

			const { data: asker } = await supabase
				.from('users')
				.select('firstName, lastName, image_url')
				.eq('id', question.asking_user_id)
				.single()
			setAsker(
				asker && {
					name: asker.firstName + ' ' + asker.lastName,
					image_url: asker.image_url,
				}
			)
		}
		fetchUsers()
	}, [post, question.asking_user_id])

	const like = async () => {
		if (liked || !user) {
			return
		}
		const { error } = await supabase.from('question_likes').insert({
			question: question.id,
			user: user.id,
		})
		if (error) {
			toast.error('Like failed, please try again')
			return
		}
		setLiked(true)
		setLikes(likes + 1)
		toast.success('Liked!')
	}

	const handleAnswerSubmit = async (e: SyntheticEvent) => {
		e.preventDefault()
		if (reply == '') {
			return
		}

		const { error: answerRowError } = await supabase
			.from('questions')
			.update({
				answer: reply,
				last_updated: new Date().toISOString(),
			})
			.eq('id', question.id)
		if (answerRowError) {
			toast.error('Bid post failed, please try again')
			return
		}

		if (post && question) {
			await notification({
				kind: 'QUESTION_ANSWERED',
				message: `The question you posted on '${post.title}' has been answered.`,
				recipient: question.asking_user_id,
				sender: post.owner_id,
				href: `/post/${post.id}`,
			})
		}

		router.refresh()
	}

	const deleteQuestion = async () => {
		const {
			data: { session },
			error,
		} = await supabase.auth.getSession()
		if (error) {
			toast.error(error.message)
			return
		}
		if (session === null) return
		const token = session.access_token
		const res = await fetch('/api/question', {
			body: JSON.stringify({ question: question.id }),
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		if (!res.ok) {
			toast.error('Failed to delete question')
			return
		} else {
			toast.success('Question deleted')
			router.refresh()
		}
	}

	const canDelete =
		user?.id === question.asking_user_id || user?.role === 'admin'

	return (
		<div className='flex gap-4 p-2 py-3'>
			{/* Profile Icon */}
			<Link href={`/profile/${question.asking_user_id}`}>
				{asker?.image_url ? (
					<img
						src={asker.image_url}
						alt='Profile Picture'
						className='h-8 w-8 rounded-full'
					/>
				) : (
					<span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100'>
						<svg
							className='h-full w-full text-gray-300'
							fill='currentColor'
							viewBox='0 0 24 24'
						>
							<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
						</svg>
					</span>
				)}
			</Link>

			<div className='mt-1 flex flex-1 flex-col'>
				{/* Name and actions */}
				<div className='flex justify-between'>
					<Link
						href={`/profile/${question.asking_user_id}`}
						className='font-semibold'
					>
						{question.asking_firstName} {question.asking_lastName}
					</Link>

					<div className='flex gap-3'>
						<button
							onClick={like}
							className={
								'flex items-center gap-1 ' +
								(liked ? ' cursor-not-allowed' : '')
							}
						>
							{liked ? (
								<LikedHeart className='h-5 w-5 text-red-600' />
							) : (
								<Heart className='h-5 w-5 text-gray-600' />
							)}
							<span>{likes}</span>
						</button>

						{canDelete && (
							<button onClick={deleteQuestion}>
								<TrashIcon className='h-5 w-5 text-gray-600' />
							</button>
						)}
					</div>
				</div>

				{/* Question */}
				<p className='text-sm'>{question.question}</p>

				{question.answer && (
					<Link
						href={`/profile/${post.owner_id}`}
						className='flex gap-3 pt-3'
					>
						{owner?.image_url ? (
							<img
								src={owner.image_url}
								alt='Profile Picture'
								className='h-8 w-8 rounded-full'
							/>
						) : (
							<span className='inline-block h-8 w-8 overflow-hidden rounded-full bg-gray-100'>
								<svg
									className='h-full w-full text-gray-300'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z' />
								</svg>
							</span>
						)}
						<div className='mt-1 flex flex-1 flex-col'>
							<Link
								href={`/profile/${post.owner_id}`}
								className='font-bold'
							>
								{owner ? owner.name : 'Post Owner'}
							</Link>
							<p className='text-sm'>{question.answer}</p>
						</div>
					</Link>
				)}

				{/* Reply to post */}
				{!question.answer && user?.id === post.owner_id && (
					<form
						onSubmit={handleAnswerSubmit}
						className='mt-2 flex rounded-md shadow-sm'
					>
						<div className='relative flex flex-grow items-stretch focus-within:z-10'>
							<input
								type='text'
								name='search'
								id='search'
								value={reply}
								onChange={(e) => setReply(e.target.value)}
								className='block w-full rounded-none rounded-l-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
								placeholder='Reply'
							/>
						</div>
						<button
							type='submit'
							className='group relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md py-2 pl-3 pr-2 text-sm text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-indigo-600'
						>
							<PaperAirplaneIcon
								className='-ml-0.5 h-5 w-5 text-gray-400 group-hover:text-white'
								aria-hidden='true'
							/>
						</button>
					</form>
				)}
			</div>
		</div>
	)
}
