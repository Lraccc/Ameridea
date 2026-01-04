export interface Claim {
  id: string;
  claimNumber: string;
  date: string;
  provider: string;
  service: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing';
  description: string;
  submittedDate: string;
  processedDate?: string;
}

export interface ClaimDetails extends Claim {
  patientName: string;
  policyNumber: string;
  diagnosis?: string;
  notes?: string;
}