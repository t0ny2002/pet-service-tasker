import { Page } from '@/lib/types/global'
export const categories = [
	'Pet walking',
	'Pet sitting',
	'Pet grooming',
	'Pet training',
	'Pet feeding',
	'Pet boarding',
	'Pet transport',
	'Pet health care',
]

export const post_status = ['todo', 'progress', 'done', 'hidden']

export const loggedOutPages: Page[] = [{ name: 'Find Posts', href: '/posts' }]

export const ownerPages: Page[] = [
	{ name: 'Find Posts', href: '/posts' },
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Post Task', href: '/post' },
	{ name: 'Messages', href: '/chats' },
	{ name: 'Profile', href: '/profile' },
]

export const carerPages: Page[] = [
	{ name: 'Find Posts', href: '/posts' },
	{ name: 'Dashboard', href: '/dashboard' },
	{ name: 'Messages', href: '/chats' },
	{ name: 'Profile', href: '/profile' },
]

export const adminPages: Page[] = [
	{ name: 'Find Posts', href: '/posts' },
	{ name: 'Dashboard', href: '/admin' },
	{ name: 'Actions', href: '/admin/actions' },
	{ name: 'Posts', href: '/admin/posts' },
	{ name: 'Users', href: '/admin/users' },
]
