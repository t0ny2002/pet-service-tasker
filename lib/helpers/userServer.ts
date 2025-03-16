import { serverSupabase } from '../serverSupabase'
import { Database } from '../types/supabase'

export type UserDetails = {
	email: string
} & Database['public']['Tables']['users']['Row']


// Get user details on the server
export async function getUserDetails(id?: string): Promise<UserDetails | null> {
  const supabase = serverSupabase()
  let userId = id
  let email = ''
  if (!id) {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      return null
    }
    userId = user?.id
    email = user?.email || ''
  } 

	if (!userId) {
		return null
	}

	const { data: userDetails, error: detailsError } = await supabase
		.from('users')
		.select('*')
		.eq('id', userId)
		.single()
	if (detailsError) {
		return null
	}
	if (!userDetails) {
		return null
	}
	return { ...userDetails, email: email } as UserDetails
}
