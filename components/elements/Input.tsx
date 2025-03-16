import { ExclamationCircleIcon } from '@heroicons/react/20/solid'
import { classNames } from '@/lib/helpers/simple'

interface InputProps {
	id?: string
	name?: string
	label?: string
	type?: 'text' | 'email' | 'password' | 'textarea'
	value: string
	placeholder?: string
	required?: boolean
	fullWidth?: boolean

	onChange: (onChangeProps: { value: string }) => void

	errorControl?: {
		value: boolean
		text: string
	}
}

/**
 * Input element
 *
 * By default:
 *  - `id = crypto.randomUUID()`
 *  - `type = 'text'`
 *  - `required = false`
 */
export function Input({
	id,
	name,
	label,
	type = 'text',
	value,
	placeholder,
	required = false,
	fullWidth = false,
	onChange,
	errorControl,
}: InputProps) {
	if (!id) id = crypto.randomUUID()
	if (!name) name = id

	return (
		<div className={fullWidth ? 'w-full' : ''}>
			{label && (
				<label className='mb-1 block text-sm font-medium leading-6 text-gray-900'>
					{label}
				</label>
			)}
			<div className='relative rounded-md shadow-sm'>
				{type === 'textarea' ? (
					<textarea
						id={id}
						name={name}
						value={value}
						onChange={(e) => onChange({ value: e.target.value })}
						aria-invalid={errorControl?.value === true}
						className={classNames(
							'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
							'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
							'aria-[invalid=true]:pr-10 aria-[invalid=true]:text-red-900 aria-[invalid=true]:ring-red-500'
						)}
						rows={3}
						placeholder={placeholder}
						required={required}
					/>
				) : (
					<input
						id={id}
						type={type}
						name={name}
						value={value}
						onChange={(e) => onChange({ value: e.target.value })}
						aria-invalid={errorControl?.value === true}
						className={classNames(
							'block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300',
							'placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6',
							'aria-[invalid=true]:pr-10 aria-[invalid=true]:text-red-900 aria-[invalid=true]:ring-red-500'
						)}
						placeholder={placeholder}
						required={required}
					/>
				)}
				{errorControl?.value && (
					<div className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
						<ExclamationCircleIcon
							className='h-5 w-5 text-red-500'
							aria-hidden='true'
						/>
					</div>
				)}
			</div>
			{errorControl && (
				<span
					aria-invalid={errorControl?.value === true}
					className='hidden text-xs text-red-600 aria-[invalid=true]:inline'
				>
					{errorControl.text}
				</span>
			)}
		</div>
	)
}
