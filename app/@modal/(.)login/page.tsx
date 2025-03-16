import { PageModal } from '@/components/modals'
import LoginForm from '@/components/auth/LoginForm'

// A parallel and intercepted route to have both modal functionality and as its own route
export default function SignUpModal() {
	return (
		<PageModal>
			<div className='bg-white sm:rounded-lg p-6'>
				<LoginForm />
			</div>
		</PageModal>
	)
}
