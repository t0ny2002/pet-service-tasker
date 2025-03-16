import { AdminRegisterForm } from '@/components/auth/AdminRegister'

export default function AdminRegister({
	params,
}: {
	params: { token: string }
}) {
	return (
		<main className='w-full max-w-screen-md mx-auto p-6 sm:p-10'>
			<AdminRegisterForm token={params.token} />
		</main>
	)
}
