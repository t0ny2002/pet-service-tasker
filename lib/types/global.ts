export type Icon = 'dashboard' | 'person' | 'post' | 'bid' | 'home'

export type TaskProgress =
	| 'todo'
	| 'progress'
	| 'done'
	| 'paid'
	| 'complete'
	| 'hidden'

export interface Page {
	name: string
	href: string
}

export type NotificationKind =
	| 'BID_MADE'
	| 'BID_CHOSEN'
	| 'TASK_COMPLETE'
	| 'TASK_PAID'
	| 'QUESTION_ANSWERED'
	| 'QUESTION_ASKED'
	| 'RATE_OWNER'
	| 'RATE_CARER'
  | 'MESSAGE'

export interface NotificationBody {
	kind: NotificationKind
	message: string
	recipient: string
	sender: string
	href: string
}

export type ActionKind = 'CONFIRM_PAY' | 'REPORT'
