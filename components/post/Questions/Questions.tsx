import { serverSupabase } from '@/lib/serverSupabase'
import { PostDetails, PostQuestion } from '..'
import Question from './Question'
import { getUserDetails } from '@/lib/helpers/userServer'

export const dynamic = 'force-dynamic'

export default async function Questions({ post }: { post: PostDetails }) {
	const supabase = serverSupabase()
	const currentUser = await getUserDetails()
	const { data: questionsData, error: questionsError } = await supabase
		.from('questions')
		.select('*, users(*)')
		.eq('post_id', post.id)
	if (questionsError) {
		return <div>Error: {questionsError.message}</div>
	}
	const { data: questionLikeData, error: questionLikeError } = await supabase
		.from('question_likes')
		.select('*')
		.in(
			'question',
			questionsData.map((q) => q.id)
		)
	if (questionLikeError) {
		console.error(
			`Couldn't find question likes: ${questionLikeError.message}`
		)
	}

	const parsedQuestions: PostQuestion[] = questionsData
		.map((question) => {
			const likes = questionLikeData?.filter(
				(q) => q.question === question.id
			)
			const liked = likes?.find((q) => q.user === currentUser?.id)
			return {
				id: question.id,
				question: question.question,
				answer: question.answer,
				asking_firstName: question.users?.firstName || 'Unknown',
				asking_lastName: question.users?.lastName || 'Unknown',
				asking_user_id: question.asking_user,
				last_updated: question.last_updated,
				likes: likes?.length || 0,
				liked: !!liked,
			}
		})
		.sort((a, b) => {
			// Sort answered quetions first, then by latest updated
			if (a.answer && (b.answer == null || b.answer == '')) return -1
			if (b.answer && (a.answer == null || a.answer == '')) return 1

			if (a.last_updated && b.last_updated) {
				return a.last_updated > b.last_updated ? -1 : 1
			} else if (a.last_updated) {
				return -1
			} else {
				return 1
			}
		})

	return (
		<div>
			<ul role='list'>
				{parsedQuestions.map((question) => (
					<Question
						question={question}
						key={question.id}
						post={post}
						user={currentUser}
					/>
				))}
			</ul>
		</div>
	)
}
