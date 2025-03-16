import { supabase } from '@/lib/clientSupabase'
import { Database } from '@/lib/types/supabase'
import { BellIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
	AiFillNotification,
	AiOutlineClose,
	AiOutlineNotification,
} from 'react-icons/ai'
import { useRouter } from 'next/navigation'

export default function Notifications({ className }: { className?: string }) {
	const [notifications, setNotifications] = useState<
		Database['public']['Tables']['notifications']['Row'][]
	>([])
	const [count, setCount] = useState(0)
	const [modal, setModal] = useState(false)
	const [token, setToken] = useState('')
	const router = useRouter()

	useEffect(() => {
		const fetchNotifications = async () => {
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
			setToken(token)

			const res = await fetch(`/api/notification`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`,
				},
			})
			const data = await res.json()
			setNotifications(data.notifications)
			setCount(data.countUnread)
		}
		fetchNotifications()
	}, [])

	const handleClick = async () => {
		if (notifications.length === 0) {
			toast('No notifications yet!')
			return
		}
		setModal(true)
	}

	const readAll = async () => {
		await fetch(`/api/notification/read`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		})
		setCount(0)
		setModal(false)

		setNotifications((prev) => {
			return prev.map((value) => {
				return {
					...value,
					viewed: true,
				}
			})
		})
		router.refresh()
	}

	return (
		<>
			<button
				type='button'
				className={
					'relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ' +
					className
				}
				onClick={handleClick}
			>
				<span className='absolute -inset-1.5' />
				<span className='sr-only'>View notifications</span>
				<BellIcon className='h-6 w-6' aria-hidden='true' />
				{count > 0 && (
					<div className='absolute right-0 top-0 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-red-600 px-2 py-1 text-xs font-bold leading-none text-red-100'>
						{count}
					</div>
				)}
			</button>
			{modal && notifications.length > 0 && (
				<>
					<div
						onClick={() => setModal(false)}
						className='fixed left-0 top-0 z-10 h-screen w-screen bg-slate-500/50'
					></div>
					<div className='fixed left-0 top-0 z-20 h-full w-full overflow-scroll sm:left-[35vw] sm:top-11 sm:max-h-[75vh] sm:w-96 sm:rounded-lg md:left-[48vw] xl:left-[54vw]'>
						<div className='flex flex-col gap-2 bg-white p-6 sm:rounded-lg'>
							<div className='flex items-center justify-between'>
								<h1 className='text-2xl font-semibold'>
									Notifications
								</h1>
								<AiOutlineClose
									className='float-right h-6 w-6 cursor-pointer'
									onClick={() => setModal(false)}
								/>
							</div>

							<button
								className='hover:text-inido-600 border-t-2 border-gray-300 pt-2 text-indigo-500'
								onClick={readAll}
							>
								Mark all as read
							</button>
							{notifications.map((value) => {
								return (
									<div
										onClick={() => {
											setModal(false)
										}}
										key={value.id}
										// If not read the background color is gray
										className={
											'w-full border-t-2 border-gray-300 p-2' +
											(value.viewed ? '' : ' font-bold')
										}
									>
										<Link
											href={value.href}
											className='flex items-center justify-between gap-2'
										>
											{value.viewed && (
												<AiOutlineNotification className='h-8 w-8 rounded-full text-indigo-500' />
											)}
											{!value.viewed && (
												<AiFillNotification className='h-8 w-8 rounded-full text-indigo-500' />
											)}
											<div className='w-4/5 text-sm text-gray-500'>
												{value.message}
											</div>
										</Link>
									</div>
								)
							})}
						</div>
					</div>
				</>
			)}
		</>
	)
}
