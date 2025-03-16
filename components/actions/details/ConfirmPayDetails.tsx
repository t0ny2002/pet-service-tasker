'use client'
import { useEffect, useState } from 'react'
import { BiSolidCategory, BiSolidUser } from 'react-icons/bi'
import { FaLocationDot } from 'react-icons/fa6'
import toast from 'react-hot-toast'

import Loading from '@/components/Loading'
import { BidderDetails, OwnerDetails, PostDetails } from '@/components/post'

import Link from 'next/link'
import { Database } from '@/lib/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { formatDateString } from '@/lib/helpers/dates'
import { AiFillCalendar } from 'react-icons/ai'
import { IoTimerSharp } from 'react-icons/io5'

type Action = Database['public']['Tables']['actions']['Row']

export function ConfirmPayDetails({
	post_id,
	admin_id,
	action,
}: {
	post_id: number
	admin_id: string
	action: Action
}) {
	const [post, setPost] = useState<PostDetails>()
	const [loading, setLoading] = useState(true)

	// Owner Information
	const [owner, setOwner] = useState<OwnerDetails>(null)

	// Bidder Information
	const [bidder, setBidder] = useState<BidderDetails>(null)

  const [image, setImage] = useState<string | null>(null)

  const [confirmed, setConfirmed] = useState(false)

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
		async function getPost() {
			const { data: postData, error: postError } = await supabase
				.from('posts')
				.select('*')
				.eq('id', post_id)
				.single()

			if (postError) {
				toast.error(`Couldn't find post: ${postError.message}`)
				return
			}
			setPost(postData)

			// Get the owner of the post
			const { data: ownerData, error: ownerError } = await supabase
				.from('users')
				.select('*')
				.eq('id', postData.owner_id)
				.single()
			if (ownerError) {
				toast.error(`Couldn't find owner: ${ownerError.message}`)
				return
			}
			setOwner(ownerData)

			if (postData.selected_bidder) {
				// Get the selected bidder of the post
				const { data: bidderData, error: bidderError } = await supabase
					.from('bids')
					.select('*, users(*)')
					.eq('post_id', post_id)
					.eq('bidder_id', postData.selected_bidder)
					.single()
				if (bidderError) {
					toast.error(`Couldn't find owner: ${bidderError.message}`)
					return
				}

				setBidder({
					amount: bidderData.amount,
					bio: bidderData.users ? bidderData.users.bio : null,
					created_at: bidderData.created_at,
					firstName: bidderData.users
						? bidderData.users.firstName
						: '',
					id: bidderData.bidder_id,
					lastName: bidderData.users ? bidderData.users.lastName : '',
				})
			}

			const {
				data: { session },
				error,
			} = await supabase.auth.getSession()
			if (error) {
				toast.error(error.message)
				return
			}
			if (session !== null) {
				const token = session.access_token

				const res = await fetch(`/api/admin/image/${post_id}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json',
						Authorization: `Bearer ${token}`,
					},
				})
				if (res.ok) {
					const image = await res.text()
					setImage(image)
				}
			}

			setLoading(false)
		}
		getPost()
  }, [post_id, supabase])

  async function processConfirmation() {
		const { error: updateActionError } = await supabase
			.from('actions')
			.update({ status: 'done' })
			.eq('id', action.id)

		if (updateActionError) {
			toast.error(`Couldn't find post: ${updateActionError.message}`)
			return
		}

		const { error: updatePostError } = await supabase
			.from('posts')
			.update({ status: 'complete' })
			.eq('id', post_id)

		if (updatePostError) {
			toast.error(`Couldn't find post: ${updatePostError.message}`)
			return
		}
		setConfirmed(true)
  }

  if (loading) {
		return (
			<div className='mt-16 flex w-full items-center justify-center'>
				<Loading />
			</div>
		)
  }
  return (
		post &&
		owner &&
		bidder && (
			<div className='my-4 text-center'>
				<div className='flex flex-row gap-3'>
					<span className=' text-2xl font-bold'>{post.title}</span>
					<Link
						href={`/post/${post_id}`}
						className='cursor-pointer rounded-lg border bg-gray-100 p-1 text-sm transition hover:bg-gray-200'
					>
						<p>View Original Post</p>
					</Link>
				</div>
				<div className='my-4 flex-row gap-[30%] md:flex'>
					<div className='flex flex-col'>
						<div className='my-4 flex flex-row gap-4 text-lg'>
							<AiFillCalendar size={26} />
							{post.start_time
								? formatDateString(post.start_time)
								: ''}
						</div>
						<div className='my-4 flex flex-row gap-4 text-lg'>
							<IoTimerSharp size={26} />
							{post.location}
						</div>
					</div>

					<div className='flex flex-col'>
						<div className='my-4 flex flex-row gap-4 text-lg'>
							<BiSolidCategory size={26} />
							{post.category}
						</div>
						<div className='my-4 flex flex-row gap-4 text-lg'>
							<FaLocationDot size={26} />
							{post.location}
						</div>
					</div>
				</div>
				{!!image && (
					<div className='mx-auto max-w-2xl'>
						<h1 className='text-2xl font-bold'>Receipt Image</h1>
						<img
							src={image}
							alt='not found'
							className='w-full rounded-lg'
						/>
					</div>
				)}
				<div className='mt-20 flex flex-row place-items-center justify-center gap-[20%]'>
					<Link
						href={`/profile/${post.owner_id}`}
						className='flex cursor-pointer flex-col items-center rounded-2xl border border-gray-500 p-2'
					>
						<BiSolidUser size={48} />
						<p>
							{owner.firstName} {owner.lastName}
						</p>
						(Owner)
					</Link>
					<div className='flex flex-col items-center '>
						<div className='flex items-center justify-center gap-4 bg-white'>
							<span className='sr-only'>Loading...</span>
							<div className='h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.3s]'></div>
							<div className='h-4 w-4 animate-bounce rounded-full bg-black [animation-delay:-0.15s]'></div>
							<div className='h-4 w-4 animate-bounce rounded-full bg-black'></div>
						</div>
						<div className='py-3 text-lg'>${bidder.amount}.00</div>
					</div>

					<Link
						href={`/profile/${post.selected_bidder}`}
						className='flex cursor-pointer flex-col items-center rounded-2xl border border-gray-500 p-2'
					>
						<BiSolidUser size={48} />
						<p>
							{bidder?.firstName} {bidder?.lastName}
						</p>
						(Carer)
					</Link>
				</div>
				{action.assigned_to === String(admin_id) && !confirmed && (
					<button
						onClick={() => processConfirmation()}
						className='my-8 rounded-xl border bg-green-300 p-2 transition hover:bg-green-400'
					>
						Confirm Payment
					</button>
				)}

				{!!confirmed && (
					<div className='my-8 text-green-500'>Confirmed!</div>
				)}
			</div>
		)
  )
}
