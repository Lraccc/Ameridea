import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield } from 'lucide-react';

export default function InsurancePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">My Insurance</h1>
      <Card>
        <CardHeader>
          <CardTitle>Insurance Policies</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Shield className="h-16 w-16 mb-4" />
            <p>Insurance details coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
