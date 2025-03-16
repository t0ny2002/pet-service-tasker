'use client'

import { Toaster } from 'react-hot-toast'

const ClientOnly: React.FC = () => {
	// Added the toaster as a client component
	return (
		<div>
			<Toaster />
		</div>
	)
}

export default ClientOnly
