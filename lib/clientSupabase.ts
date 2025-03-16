import {
	User,
	createClientComponentClient,
} from '@supabase/auth-helpers-nextjs'
import { Database } from './types/supabase'

export const supabase = createClientComponentClient<Database>()

export const getUser = async (): Promise<User | null> => {
	const session = await supabase.auth.getSession()

	if (session.data.session !== null) {
		return session.data.session.user
	}

	return null
}
