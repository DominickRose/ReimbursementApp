const urlSearchParams = new URLSearchParams(window.location.search);
const empId = urlSearchParams.get('id');

const welcomeMessage = document.getElementById('welcomeMessage');
const approvedAmount = document.getElementById('approvedAmount');
const reimbursementTable = document.getElementById('reimbursementTable');
const filterChoices = document.getElementById("filterChoices");
const amountInput = document.getElementById('amountInput');
const reasonInput = document.getElementById('descriptionInput');

let reimbursements;

async function empInitialize() {
	const empBody = await fetchEmployees(empId);
	welcomeMessage.innerHTML += empBody['firstName']

	reimbursements = (await fetchReimbursements(empId)).sort((first, second) => first.date - second.date);
	populateTable();
}

async function populateTable() {
	reimbursementTable.innerHTML = '';
	if (filterChoices.value !== 'All') {
		reimbursements.filter((reimbursement) => reimbursement.status == filterChoices.value).forEach(addToTable);
	}
	else {
		reimbursements.forEach(addToTable);
	}

	approvedAmount.innerHTML = `$${calcSum(reimbursements, 'Approved')}`;
}

function createDelete(reimbursement) {
	return reimbursement.status === 'Pending' ?
		`<button class='btn-danger' id="delete_${reimbursement.reimbursementId}" onclick="deleteRequest(${reimbursement.reimbursementId})">Delete</button>` :
		''
}

function addToTable(reimbursement) {
	const date = new Date();
	date.setTime(reimbursement.date)

	reimbursementTable.innerHTML += `<tr><td>${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}</td><td>$${reimbursement.amount}</td><td>${reimbursement.reason}</td><td class="statusValue">${reimbursement.status}</td><td>${reimbursement.mgrMessage}</td><td>${createDelete(reimbursement)}</td></tr>`
}

async function submitRequest() {
	const body = {
		reimbursementId: 0,
		ownerId: empId,
		amount: parseInt(amountInput.value),
		reason: reasonInput.value,
		status: 'Pending',
		mgrMessage: '',
		date: new Date().getTime()
	}

	console.log(body);

	const config = {
		method: "POST",
		headers: {'Content-Type':'application/json'},
		body: JSON.stringify(body)
	};

	post_result = await fetch('http://localhost:5000/reimbursements', config);
	if (post_result.status === 201) {
		reimbursements = (await fetchReimbursements(empId)).sort((first, second) => first.date - second.date);
		populateTable();
	}
}

async function deleteRequest(id) {
	const config = {
		method: "DELETE"
	}
	const shouldContinue = confirm("Are you sure you want to delete?");
	if (shouldContinue) {
		const result = await fetch(`http://localhost:5000/reimbursements/${id}`, config);
		if (result.status == 205) {
			reimbursements = (await fetchReimbursements(empId)).sort((first, second) => first.date - second.date);
			populateTable();
		}
	}
}