let test = [{status:'approved', amount:15}, {status:'approved', amount:27}, {status:'rejected', amount:500}]

function calcSum(reimbursementArray, status) {
	let interestedArray = reimbursementArray
	if (status !== 'all') {
		interestedArray = reimbursementArray.filter((reimbursement) => reimbursement.status === status)
	}
	sum = interestedArray.reduce((sum, reimbursement) => sum + reimbursement.amount, 0)
	return sum
}