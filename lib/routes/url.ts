export const baseUrl = () => {
	const url =
		process.env.NEXT_PUBLIC_VERCEL_URL ||
		process.env.VERCEL_URL ||
		process.env.NEXT_PUBLIC_URL ||
		process.env.URL ||
		'localhost:3000'
	if (url.startsWith('localhost')) {
		return `http://${url}`
	}
	return `https://${url}`
}
