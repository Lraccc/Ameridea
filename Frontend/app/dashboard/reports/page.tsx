import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileBarChart } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
      <Card>
        <CardHeader>
          <CardTitle>Insurance Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <FileBarChart className="h-16 w-16 mb-4" />
            <p>Reports content coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
