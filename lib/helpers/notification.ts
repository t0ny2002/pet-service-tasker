import { baseUrl } from '../routes/url'
import { NotificationBody } from '../types/global'

export default async function notification({
	kind,
	message,
	recipient,
	sender,
	href,
}: NotificationBody) {
	const res = await fetch(baseUrl() + '/api/notification', {
		method: 'POST',
		body: JSON.stringify({
			kind,
			message,
			recipient,
			sender,
			href,
		}),
	})
	const text = await res.text()
	if (res.status !== 200) {
		console.error(text)
	}
}
