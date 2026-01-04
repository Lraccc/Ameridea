export interface HistoryItem {
  id: string;
  type: 'claim' | 'loa' | 'certificate' | 'message';
  title: string;
  description: string;
  date: string;
  status?: string;
  amount?: number;
}