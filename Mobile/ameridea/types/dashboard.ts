export interface BillsPayable {
  id: string;
  description: string;
  hospitalBill: number;
  insuranceCoverage: number;
  amount: number; // Amount user needs to pay (hospitalBill - insuranceCoverage)
  dueDate: string;
  status: 'Pending' | 'Overdue' | 'Paid';
}

export interface DashboardData {
  greeting: string;
  activePolicyNumber: string;
  policyStatus: string;
  billsPayable: BillsPayable[];
  totalAmountDue: number;
}