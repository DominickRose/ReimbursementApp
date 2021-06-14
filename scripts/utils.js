let test = [{status:'approved', amount:15}, {status:'approved', amount:27}, {status:'rejected', amount:500}]

function calcSum(reimbursementArray, status) {
	let interestedArray = reimbursementArray
	if (status !== 'all') {
		interestedArray = reimbursementArray.filter((reimbursement) => reimbursement.status === status)
	}
	sum = interestedArray.reduce((sum, reimbursement) => sum + reimbursement.amount, 0)
	return sum
}

async function fetchReimbursements(empId) {
	let response;
	if (empId === undefined) {
		response = await fetch("http://localhost:5000/reimbursements");
	}
	else {
		response = await fetch("http://localhost:5000/reimbursements?owner=" + empId);
	}
	return response.json();
}

async function fetchEmployees(empId) {
	let response;
	let empDict = {};
	if (empId === undefined) {
		response = await fetch("http://localhost:5000/users");
		body = await response.json();
		body.forEach((employee) => empDict[employee.userId] = `${employee.firstName} ${employee.lastName}`)
		return empDict;
	}

	else {
		response = await fetch("http://localhost:5000/users/" + empId);
		return response.json();
	}
}