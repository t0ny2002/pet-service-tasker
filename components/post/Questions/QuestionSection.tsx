import { PostDetails } from '../index'
import { QuestionForm } from './QuestionForm'
import Questions from './Questions'

export default function QuestionSection({ post }: { post: PostDetails }) {
	return (
		<div>
			<Questions post={post} />
			<QuestionForm post={post} />
		</div>
	)
}
