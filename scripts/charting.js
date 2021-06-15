async function initializeCharts() {
	const empRequest = await fetch("http://localhost:5000/users");
	const allEmployees = await empRequest.json();
	let piePoints = await Promise.all(allEmployees.map(calculateRequestTotal));

	const reimbursementRequest = await fetch("http://localhost:5000/reimbursements");
	const allReimbursements = await reimbursementRequest.json();

	JSC.Chart('requestDistributionChart', { 
		debug: true, 
		title_position: 'center', 
		legend: { 
		  template: 
		    '$%value {%percentOfTotal:n1}% %icon %name', 
		  position: 'inside left bottom'
		}, 
		defaultSeries: { 
		  type: 'pie', 
		  pointSelection: true
		}, 
		defaultPoint_label_text: '<b>%name</b>', 
		title_label_text: 'Employee Reimbursement Requests', 
		yAxis: { label_text: 'Request', formatString: 'n' }, 
		series: [ 
		  { 
		    name: 'Employees', 
		    points: piePoints.filter((employee) => employee.name !== "manager")
		  } 
		] 
	      });
	      
	JSC.chart('rejectedAcceptedChart', { 
	debug: true, 
	defaultSeries_type: 'column', 
	toolbar_visible: false, 
	defaultPoint_label_visible: true,
	defaultPoint_label_text: '<b>$%value</b>', 
	title_label_text: 'Request Amounts by Category', 
	legend_visible: false, 
	yAxis_visible: false, 
	xAxis_line_visible: true, 
	series: [ 
		{ 
		name: 'Top Country Populations', 
		points: [ 
		{ 
		name: 'Pending', 
		y: calcSum(allReimbursements, 'Pending'), 
		fill: "yellow"
		}, 
		{ 
		name: 'Approved', 
		y: calcSum(allReimbursements, 'Approved'), 
		fill: "green"
		},
		{
		name: 'Rejected',
		y: calcSum(allReimbursements, 'Rejected'),
		fill: "red"
		}
		] 
		} 
	] 
	}); 
}

async function calculateRequestTotal(employee) {
	if (employee.empOrMgr === "emp") {
		const totalResponse = await fetch(`http://localhost:5000/reimbursements?owner=${employee.userId}`);
		const reimbursements = await totalResponse.json();
		const sum = calcSum(reimbursements, 'all');
		return {
			name: `${employee.firstName} ${employee.lastName}`,
			y: sum
		};
	}
	else {
		return {
			name: 'manager',
			y: 0
		};
	}
}

function backToDashboard() {
	const urlSearchParams = new URLSearchParams(window.location.search);
	const empId = urlSearchParams.get('id');
	window.location.href = `C:/Users/Dominick/VSCodeProjects/ReimbursementApp/html/mgrDashboard.html`
}