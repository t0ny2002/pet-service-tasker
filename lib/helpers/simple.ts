export function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ')
}

export function capitalise(string: string) {
	return string.split(' ').map(str => str[0].toUpperCase() + str.slice(1)).join(' ')
}
