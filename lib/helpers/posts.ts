import { baseUrl } from '../routes/url'

export function statusDetails(status: string): {
	colour: string
	text: string
} {
	switch (status) {
		case 'todo':
			return {
				colour: 'bg-green-50 text-green-700 ring-green-600/20',
				text: 'Open',
			}
		case 'progress':
			return {
				colour: 'bg-yellow-50 text-yellow-800 ring-yellow-600/20',
				text: 'In Progress',
			}
		case 'done':
			return {
				colour: 'bg-blue-50 text-blue-700 ring-blue-700/20',
				text: 'Finished',
			}
		case 'paid':
			return {
				colour: 'bg-purple-50 text-purple-700 ring-purple-700/20',
				text: 'Paid',
			}
		case 'complete':
			return {
				colour: 'bg-red-50 text-red-700 ring-red-600/20',
				text: 'Complete',
			}
		default:
			return {
				colour: 'bg-gray-50 text-gray-600 ring-gray-500/10',
				text: 'Hidden',
			}
	}
}

export function basicStatusDetails(status: string): {
	colour: string
	text: string
} {
	switch (status) {
		case 'todo':
			return {
				colour: 'text-green-500',
				text: 'Open',
			}
		case 'progress':
			return {
				colour: 'text-yellow-500',
				text: 'In Progress',
			}
		case 'done':
			return {
				colour: 'text-blue-500',
				text: 'Finished',
			}
		case 'paid':
			return {
				colour: 'text-purple-500',
				text: 'Paid',
			}
		case 'complete':
			return {
				colour: 'text-red-500',
				text: 'Complete',
			}
		default:
			return {
				colour: 'text-gray-500',
				text: 'Hidden',
			}
	}
}

export type PostUser = {
	id: string
	name: string
  image_url?: string | null
}

export type PostT = {
	id: number
	createdAt: string
	title: string
	status: string
	category: string
	location: string
	duration: string
	startTime: string
	description: string
	owner: PostUser
	carer: PostUser | null
	questions: number
	bids: { uid: string; amount: number }[]
	bidAmount: number | null
}

type PostJSONResponse = {
	posts: {
		id: number
		created_at: string
		title: string
		status: string
		category: string
		location: string
		duration: string
		start_time: string | null
		description: string
		owner_id: string
		selected_bidder: string | null
		owner: {
			id: string
			firstName: string
			lastName: string
      image_url: string
		}
		bidder: {
			id: string
			firstName: string
			lastName: string
		} | null
		questions: {
			id: string
		}[]
		bids: {
			bidder_id: string
			amount: number
		}[]
	}[]
}

export async function getPosts(): Promise<PostT[]> {
	const res = await fetch(`${baseUrl()}/api/posts`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	})
	if (!res.ok) {
		return []
	}
	const data: PostJSONResponse = await res.json()
	return data.posts.map((post) => {
		return {
			id: post.id,
			createdAt: post.created_at,
			title: post.title,
			status: post.status,
			category: post.category,
			location: post.location,
			duration: post.duration,
			startTime: post.start_time || 'unknown',
			description: post.description,
			owner: {
				id: post.owner.id,
				name: post.owner.firstName + ' ' + post.owner.lastName,
        image_url: post.owner.image_url,
			},
			carer: post.bidder
				? {
						id: post.bidder.id,
						name:
							post.bidder.firstName + ' ' + post.bidder.lastName,
				}
				: null,
			questions: post.questions.length,
			bids: post.bids.map((bid) => ({
				uid: bid.bidder_id,
				amount: bid.amount,
			})),
			bidAmount: post.bidder
				? (
						post.bids.find(
							(bid) => bid.bidder_id === post.bidder?.id
						) || { amount: null }
				).amount
				: null,
		}
	})
}
