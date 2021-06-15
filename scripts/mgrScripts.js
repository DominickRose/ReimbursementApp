const urlSearchParams = new URLSearchParams(window.location.search);
const empId = urlSearchParams.get('id');

const welcomeMessage = document.getElementById('welcomeMessage');
const reimbursementTable = document.getElementById('reimbursementTable');
const totalRequests = document.getElementById('totalRequests');
const pendingRequests = document.getElementById('pendingRequests');

const statusFilter = document.getElementById("statusFilter");
const employeeFilter = document.getElementById('employeeFilter');

const approvalCommentInput = document.getElementById('approvalCommentInput');
const rejectionCommnetInput = document.getElementById('rejectionCommentInput')

let reimbursements;
let employees;
let activeReimbursement = 0;

async function initialize() {
	employees = await fetchEmployees();
	welcomeMessage.innerHTML += employees[empId];

	for(const employee in employees) {
		employeeFilter.innerHTML += `<option value = ${employee}>${employees[employee]}</option>`
	}

	reimbursements = (await fetchReimbursements()).sort((first, second) => first.date - second.date);
	populateTable();

}

async function populateTable() {
	reimbursementTable.innerHTML = "";
	if (statusFilter.value === "All" && employeeFilter.value === "All") {
		reimbursements.forEach(addToTable);
	}

	else if (statusFilter.value === "All") {
		reimbursements.filter((reimbursement) => reimbursement.ownerId == employeeFilter.value).forEach(addToTable);
	}

	else if (employeeFilter.value === "All") {
		reimbursements.filter((reimbursement) => reimbursement.status == statusFilter.value).forEach(addToTable);
	}
	else {
		reimbursements.filter((reimbursement) => reimbursement.status == statusFilter.value && reimbursement.ownerId == employeeFilter.value).forEach(addToTable);
	}

	pendingRequests.innerHTML = reimbursements.filter((reimbursement) => reimbursement.status == 'Pending').length
	totalRequests.innerHTML = reimbursements.length
}

function addToTable(reimbursement) {
	const date = new Date();
	date.setTime(reimbursement.date)

	reimbursementTable.innerHTML += `<tr><td>${date.getUTCMonth() + 1}/${date.getUTCDate()}/${date.getUTCFullYear()}</td><td>$${reimbursement.amount}</td><td>${employees[reimbursement.ownerId]}</td><td>${reimbursement.reason}</td><td class="reimbursement-status">${reimbursement.status}</td><td>${createButtons(reimbursement)}</td></tr>`
}

function createButtons(reimbursement) {
	return reimbursement.status === 'Pending' ? 
		`<button class='reject-btn btn-danger' data-toggle="modal" data-target=#rejectRequestModal onclick='activeReimbursement = ${reimbursement.reimbursementId}'>Reject</button> <button class = 'approve-btn btn-primary' data-toggle="modal" data-target=#approveRequestModal onclick='activeReimbursement = ${reimbursement.reimbursementId}'>Approve</button>` : 
		''
}

async function submitChange(action) {
	message = action == "Approved" ? approvalCommentInput.value : rejectionCommnetInput.value;
	const body = {
		mgrMessage: message,
		status: action
	};

	approvalCommentInput.value = '';
	rejectionCommnetInput.value = '';

	const config = {
		method: "PATCH",
		headers: {'Content-Type': 'application/json'},
		body: JSON.stringify(body)
	};

	response = await fetch(`http://localhost:5000/reimbursements/${activeReimbursement}/approve_or_deny`, config)

	if (response.status == 200) {
		reimbursements = (await fetchReimbursements()).sort((first, second) => first.date - second.date);
		populateTable();
	}
}