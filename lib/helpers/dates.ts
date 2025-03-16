export function formatDateString(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}

	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', options)
}

export function formatDateStringWithoutTime(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = {
		weekday: 'long',
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	}

	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', options)
}

export function formatSimpleDate(dateString: string): string {
	const options: Intl.DateTimeFormatOptions = {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}

	const date = new Date(dateString)
	return date.toLocaleDateString('en-US', options)
}

export function formatDateRelative(dateString: string): string {
	const relative = new Intl.RelativeTimeFormat('en', { style: 'short' })
	const date = new Date(dateString)

	const seconds = Math.floor((new Date().valueOf() - date.valueOf()) / 1000)
	if (seconds < 60) {
		return relative.format(-seconds, 'seconds')
	}
	const minutes = Math.floor(seconds / 60)
	if (minutes < 60) {
		return relative.format(-minutes, 'minutes')
	}
	const hours = Math.floor(minutes / 60)
	if (hours < 24) {
		return relative.format(-hours, 'hours')
	}
	const days = Math.floor(hours / 24)
	if (days < 30) {
		return relative.format(-days, 'days')
	}
	const months = Math.floor(days / 30)
	if (months < 12) {
		return relative.format(-months, 'months')
	}
	const years = Math.floor(days / 365)
	return relative.format(-years, 'months')
}

export function getDisplayDate(dateString: string): string {
	const createdAtDate = new Date(dateString)
	const currentDate = new Date()
	const diffInDays = Math.ceil(
		(currentDate.getTime() - createdAtDate.getTime()) /
			(1000 * 60 * 60 * 24)
	)

	let displayDate
	const diffInHours = Math.ceil(
		(currentDate.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60)
	)
	const diffInMinutes = Math.ceil(
		(currentDate.getTime() - createdAtDate.getTime()) / (1000 * 60)
	)

	if (diffInMinutes < 60) {
		displayDate = `${diffInMinutes} min`
	} else if (diffInHours < 24) {
		displayDate = `${diffInHours}h`
	} else if (diffInDays <= 7) {
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		displayDate = daysOfWeek[createdAtDate.getDay()]
	} else {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		displayDate = `${
			months[createdAtDate.getMonth()]
		} ${createdAtDate.getDate()}`
	}
	return displayDate
}

// I want a function that takes a date string timestamp and returns according to the following:
// - If seconds < 60, return "Just now"
// - If minutes < 60, return "X min ago"
// - If hours < 24, return "Xh ago"
// - If days < 7, return "Monday"
// - Else, return "January 1st"

export function formatMsgDate(dateString: string): string {
	const createdAtDate = new Date(dateString)
	const currentDate = new Date()
	const diffInDays = Math.ceil(
		(currentDate.getTime() - createdAtDate.getTime()) /
			(1000 * 60 * 60 * 24)
	)

	let displayDate
	const diffInHours = Math.round(
		(currentDate.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60)
	)
	const diffInMinutes = Math.round(
		(currentDate.getTime() - createdAtDate.getTime()) / (1000 * 60)
	)
	const diffInSeconds = Math.round(
		(currentDate.getTime() - createdAtDate.getTime()) / 1000
	)

	if (diffInSeconds < 60) {
		displayDate = 'Just now'
	} else if (diffInMinutes < 60) {
		displayDate = `${diffInMinutes} min ago`
	} else if (diffInHours < 24) {
		displayDate = `${diffInHours}h ago`
	} else if (diffInDays <= 7) {
		const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
		displayDate = daysOfWeek[createdAtDate.getDay()]
	} else {
		const months = [
			'Jan',
			'Feb',
			'Mar',
			'Apr',
			'May',
			'Jun',
			'Jul',
			'Aug',
			'Sep',
			'Oct',
			'Nov',
			'Dec',
		]
		displayDate = `${
			months[createdAtDate.getMonth()]
		} ${createdAtDate.getDate()}`
	}
	return displayDate
}
