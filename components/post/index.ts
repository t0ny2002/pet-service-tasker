import { Database } from '@/lib/types/supabase'

export type PostBid = {
	id: number
	bidder_id: string
	bidder_firstName: string
	bidder_lastName: string
	amount: number
	description: string
	selected: boolean
}

export type PostQuestion = {
	id: number
	asking_user_id: string
	asking_firstName: string
	asking_lastName: string
	answer: string | null
	question: string
	last_updated: string | null
	likes: number
	liked: boolean
}

export type PostDetails = Database['public']['Tables']['posts']['Row']

export type OwnerDetails = {
	bio: string
	created_at: string
	firstName: string
	id: string
	lastName: string
	location: string | null
	role: string
  image_url: string | null
} | null

export type BidderDetails = {
	bio: string | null
	created_at: string
	firstName: string
	lastName: string
	id: string
	amount: number
} | null
