import toast from 'react-hot-toast'
import { create } from 'zustand'
import { supabase } from '../clientSupabase'

export interface UserDetails {
	id: string | null
	role: 'carer' | 'owner' | 'admin' | null
	bio: string
	email: string
	phone: string
	firstName: string
	lastName: string
	location: string | null
}

interface UserDetailsStore extends UserDetails {
	setDetailsAsync: () => Promise<void>
	setDetails: (userDetails: UserDetails) => void
	getDetails: () => UserDetails
	resetDetails: () => void
}

// Local state management for users
const useUserDetails = create<UserDetailsStore>((set, get) => ({
	id: null,
	role: null,
	bio: '',
	email: '',
	firstName: '',
	lastName: '',
	phone: '',
	location: null,
	setDetails: (userDetails: UserDetails) => {
		set(userDetails)
		if (typeof window !== 'undefined') {
			localStorage.setItem('userDetails', JSON.stringify(userDetails))
		}
		console.log('userDetails', userDetails)
	},
	setDetailsAsync: async () => {
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser()
		if (!user) {
			toast.error('No user found')
			return
		} else if (userError !== null) {
			toast.error(userError.message)
			return
		}
		const { data: userDetails, error } = await supabase
			.from('users')
			.select('*')
			.eq('id', user.id)
			.single()

		if (error) {
			toast.error(error.message)
			return
		}
		const fixedDetails: UserDetails = {
			id: userDetails.id,
			role: userDetails.role as UserDetails['role'],
			bio: userDetails.bio,
			email: user.email || '',
			phone: user.phone || '',
			firstName: userDetails.firstName,
			lastName: userDetails.lastName,
			location: userDetails.location,
		}

		if (typeof window !== 'undefined') {
			localStorage.setItem('userDetails', JSON.stringify(fixedDetails))
		}
	},
	getDetails() {
		if (typeof window !== 'undefined') {
			const userDetails = localStorage.getItem('userDetails')
			if (userDetails) {
				return JSON.parse(userDetails)
			}
		}
		return get()
	},
	resetDetails: () => {
		set({
			id: null,
			role: null,
			bio: '',
			email: '',
			firstName: '',
			lastName: '',
			phone: '',
			location: null,
		})
		if (typeof window !== 'undefined') {
			localStorage.removeItem('userDetails')
		}
	},
}))

export default useUserDetails
