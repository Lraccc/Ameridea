import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

export default function BillPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Bill</h1>
      <Card>
        <CardHeader>
          <CardTitle>Billing & Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileText className="h-16 w-16 mb-4" />
            <p>Billing content coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
