'use client'
import { useEffect, useState } from 'react'

import toast from 'react-hot-toast'

import Link from 'next/link'
import { Database } from '@/lib/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

import { actionText } from '@/lib/helpers/actions'
import { BiSolidUser } from 'react-icons/bi'
import { IoWarningOutline } from 'react-icons/io5'
import Loading from '@/components/Loading'

type Action = Database['public']['Tables']['actions']['Row']

export function ConfirmReportDetails({
	admin_id,
	action,
}: {
	admin_id: string
	action: Action
}) {
	interface Reporter {
		firstname: string
		lastname: string
		role: string
	}
	// Reporting User Information
	const [reporter, setReporter] = useState<Reporter>({
		firstname: '',
		lastname: '',
		role: '',
	})

	const supabase = createClientComponentClient<Database>()

	const [resolved, setResolved] = useState(false)
	const [originalLink, setOriginalLink] = useState(`/`)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		async function getOriginalLink() {
			if (!action.ref) {
				setOriginalLink(`/`)
			} else if (action.kind === 'REPORT_USER') {
				setOriginalLink(`/profile/${action.ref}`)
			} else if (action.kind === 'REPORT_POST') {
				setOriginalLink(`/post/${action.ref}`)
			} else if (action.kind === 'REPORT_BID') {
				const { data: postData, error: postDataError } = await supabase
					.from('bids')
					.select('post_id')
					.eq('id', parseInt(action.ref))
					.single()

				if (postData && postData.post_id && !postDataError) {
					setOriginalLink(`/post/${postData.post_id}`)
				} else {
					console.log('Error retrieving post from bid')
					setOriginalLink(`/`)
				}
			} else {
				setOriginalLink(`/`)
			}
		}

		async function getReporter() {
			if (action.user_ref) {
				const { data: reporterData, error: reporterDataError } =
					await supabase
						.from('users')
						.select('firstName, lastName, role')
						.eq('id', action.user_ref)
						.single()

				if (reporterDataError) {
					console.log('Couldnt retrieve reporter')
				} else {
					setReporter({
						firstname: reporterData.firstName,
						lastname: reporterData.lastName,
						role: reporterData.role,
					})
				}
			}
		}

		getOriginalLink()
		getReporter()
		setLoading(false)
	}, [action, supabase])

	async function processResolution() {
		const { error: updateActionError } = await supabase
			.from('actions')
			.update({ status: 'done' })
			.eq('id', action.id)

		if (updateActionError) {
			toast.error(
				`Couldn't find reported item: ${updateActionError.message}`
			)
			return
		}
		setResolved(true)
		toast.success('Successfully Resolved!')
	}

	if (loading) {
		return (
			<div className='mt-16 flex w-full items-center justify-center'>
				<Loading />
			</div>
		)
	}
	return (
		<div className='my-4 text-center'>
			<div className='flex flex-row gap-3'>
				<span className=' text-2xl font-bold text-red-500'>
					{actionText(action.kind).title}
				</span>
				<IoWarningOutline size={32} color='red' />
				<Link
					href={originalLink}
					className='cursor-pointer rounded-lg border bg-gray-100 p-1 text-sm transition hover:bg-gray-200'
				>
					<p>View Original</p>
				</Link>
			</div>

			<div className='my-8 flex flex-col gap-8 text-left'>
				<span className='font-bold'>
					The following user has reported something on the platform:
				</span>
				<Link
					href={`/profile/${action.user_ref}`}
					className='flex w-fit cursor-pointer flex-col items-center self-center rounded-2xl border border-gray-500 p-2'
				>
					<BiSolidUser size={32} />
					<p>
						{reporter.firstname} {reporter.lastname}
					</p>
					({reporter.role})
				</Link>
				<span className='font-semibold'>
					The following complaint has been made:
				</span>

				<div className='rounded-xl border bg-gray-200 p-4 text-red-500'>
					{action.message}
				</div>
			</div>

			<div className='flex flex-row justify-center gap-1'>
				{action.assigned_to === String(admin_id) && !resolved && (
					<button
						onClick={() => processResolution()}
						className='rounded-xl border bg-green-300 p-2 transition hover:bg-green-400'
					>
						Resolve
					</button>
				)}
				<Link
					href={originalLink}
					className='cursor-pointer rounded-lg border bg-gray-100 p-2 transition hover:bg-gray-200'
				>
					<p className='p-1'>View Original</p>
				</Link>
			</div>
		</div>
	)
}
