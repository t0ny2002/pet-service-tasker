export function actionText(kind: string) {
	if (kind === 'CONFIRM_PAY') {
		return {
			title: 'Confirm Payment',
			description:
				'Payment has been sent by the owner of a completed post. Review the details to ensure everything is correct before approving payment. Once approved, the task will be closed.',
		}
	} else if (kind.startsWith('REPORT_')) {
		const title =
			kind === 'REPORT_USER'
				? 'Reported User'
				: kind === 'REPORT_POST'
				? 'Reported Post'
				: kind === 'REPORT_BID'
				? 'Reported Bid'
				: 'Unknown Report'
		return {
			title: title,
			description:
				'A report has been raised on the platform. Review the case and ensure any offensive content on display is removed and communicate with both parties to resolve the situation. Once the situation is resolved, confirm by clicking the button below.',
		}
	}
	return {
		title: 'Unknown',
		description: `The action type '${kind}' is unknown.`,
	}
}
