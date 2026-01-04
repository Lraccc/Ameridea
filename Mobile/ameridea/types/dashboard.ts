export interface BillsPayable {
  id: string;
  description: string;
  amount: number;
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