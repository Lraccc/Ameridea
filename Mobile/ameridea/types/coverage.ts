export interface Coverage {
  id: string;
  name: string;
  type: 'Medical' | 'Dental' | 'Vision' | 'Prescription';
  limit: number;
  used: number;
  remaining: number;
  description: string;
  icon: string;
}

export interface CoverageCategory {
  category: string;
  coverages: Coverage[];
}