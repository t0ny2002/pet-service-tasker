'use client'
import useUserDetails from '@/lib/hooks/useUserDetails'
import { Database } from '@/lib/types/supabase'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
// import notification from '@/lib/helpers/notification'
import { PostDetails } from '..'
import { useRouter } from 'next/navigation'
import notification from '@/lib/helpers/notification'

export function QuestionForm({ post }: { post: PostDetails }) {
	const { getDetails } = useUserDetails()
	const { id, role, firstName, lastName } = getDetails()
	const router = useRouter()

	// Post Information
	const valueError = { value: '', error: false }
	const [question, setQuestion] = useState(valueError)

	const supabase = createClientComponentClient<Database>()

	// Can User Question
	const [canUserQuestion, setCanUserQuestion] = useState(false)
	const [currentUserQuestions, setCurrentUserQuestions] = useState(0)
	useEffect(() => {
		async function getQuestionEligibility() {
			// Check if the user is able to question
			if (id && post) {
				const { data: count } = await supabase
					.from('questions')
					.select('*')
					.eq('asking_user', id)
					.eq('post_id', post.id)
				if (
					count &&
					count.length < 5 &&
					role === 'carer' &&
					post.status === 'todo'
				) {
					setCurrentUserQuestions(5 - count.length)
					setCanUserQuestion(true)
				} else {
					setCanUserQuestion(false)
				}
			}
		}
		getQuestionEligibility()
	}, [currentUserQuestions, id, post, role, supabase])

	const handleSubmitQuestion = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		let error = false
		if (!question.value) {
			setQuestion({ ...question, error: true })
			error = true
		}

		if (error) {
			return
		}

		const { error: QuestionRowError } = await supabase
			.from('questions')
			.insert({
				post_id: post.id,
				question: question.value,
			})
		if (QuestionRowError) {
			toast.error('Bid post failed, please try again')
			return
		}

		// create notification to be sent to the post owner
		if (id && post) {
			await notification({
				kind: 'QUESTION_ASKED',
				message: `On your post, ${post.title}, ${firstName} ${lastName} has asked: ${question.value}`,
				recipient: post.owner_id,
				sender: id,
				href: `/post/${post.id}`,
			})
		}

		toast.success('Question successfully posted!')
		setCurrentUserQuestions(currentUserQuestions - 1)
		setQuestion({ value: '', error: false })
		router.refresh()
	}
	return (
		canUserQuestion && (
			<div className='py-8'>
				<form
					id='questionForm'
					onSubmit={(e) => handleSubmitQuestion(e)}
					className='bg-gray-100 flex flex-col p-4 rounded-lg'
				>
					<label
						data-error={question.error}
						className='block text-black font-medium data-[error=true]:text-red-500'
					>
						Ask a question ({currentUserQuestions} left)
					</label>
					<div className='flex justify-between mt-1 items-center gap-4'>
						<input
							id='question'
							name='question'
							data-error={question.error}
							className='w-3/4 border rounded-md focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 data-[error=true]:placeholder-red-500 data-[error=true]:border-red-500'
							placeholder='Ask a Question'
							value={question.value}
							onChange={(e) =>
								setQuestion({
									value: e.target.value,
									error: false,
								})
							}
						/>

						<button
							className='bg-black text-white text-sm py-2 px-3 rounded-lg'
							type='submit'
						>
							Submit Question
						</button>
					</div>

					<span
						data-error={question.error}
						className='text-xs hidden data-[error=true]:inline data-[error=true]:text-red-500'
					>
						You must enter a valid question!
					</span>
				</form>
			</div>
		)
	)
}
