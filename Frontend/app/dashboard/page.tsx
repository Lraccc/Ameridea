'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Home,
  Car,
  Heart,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Shield,
} from 'lucide-react';

const insuranceCards = [
  {
    id: 1,
    type: 'Home Insurance',
    icon: Home,
    amount: 2594,
    status: 'active',
    users: [
      { name: 'User 1', avatar: '' },
      { name: 'User 2', avatar: '' },
      { name: 'User 3', avatar: '' },
    ],
    color: 'blue',
  },
  {
    id: 2,
    type: 'Vehicle Insurance',
    icon: Car,
    amount: 1246,
    status: 'active',
    users: [
      { name: 'User 1', avatar: '' },
      { name: 'User 2', avatar: '' },
    ],
    color: 'green',
  },
  {
    id: 3,
    type: 'Health Insurance',
    icon: Heart,
    amount: 4242,
    status: 'paused',
    users: [
      { name: 'User 1', avatar: '' },
      { name: 'User 2', avatar: '' },
    ],
    color: 'orange',
  },
];

const bills = [
  {
    id: 1,
    description: 'Home Insurance Premium',
    amount: 500,
    dueDate: '18 Feb 2025',
    status: 'pending',
  },
  {
    id: 2,
    description: 'Bill due soon',
    amount: 350,
    dueDate: '1 Mar 2025',
    status: 'upcoming',
  },
  {
    id: 3,
    description: 'Quarterly payment',
    amount: 650,
    dueDate: '15 Mar 2025',
    status: 'upcoming',
  },
];

const transactions = [
  {
    id: '#336633',
    type: 'Health Insurance',
    paymentMethod: 'Credit Card',
    amount: 60000,
    date: '16 Jan 2024, 11:14 PM',
    status: 'pending',
  },
  {
    id: '#336634',
    type: 'Vehicle Insurance',
    paymentMethod: 'Bank Transfer',
    amount: 1246,
    date: '15 Jan 2024, 09:30 AM',
    status: 'completed',
  },
  {
    id: '#336635',
    type: 'Home Insurance',
    paymentMethod: 'Credit Card',
    amount: 2594,
    date: '14 Jan 2024, 02:45 PM',
    status: 'completed',
  },
  {
    id: '#336636',
    type: 'Health Insurance',
    paymentMethod: 'PayPal',
    amount: 4242,
    date: '13 Jan 2024, 06:20 PM',
    status: 'failed',
  },
];

const chartData = [
  { day: '15 Nov', earnings: 150, investment: 200 },
  { day: '16 Nov', earnings: 80, investment: 120 },
  { day: '17 Nov', earnings: 250, investment: 180 },
  { day: '18 Nov', earnings: 180, investment: 280 },
  { day: '19 Nov', earnings: 280, investment: 150 },
  { day: '20 Nov', earnings: 320, investment: 200 },
  { day: '21 Nov', earnings: 380, investment: 350 },
  { day: '22 Nov', earnings: 180, investment: 100 },
];

export default function DashboardPage() {
  const [timePeriod, setTimePeriod] = useState('weekly');

  const maxValue = Math.max(
    ...chartData.flatMap((d) => [d.earnings, d.investment])
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                My Insurance
              </h2>
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                See All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {insuranceCards.map((insurance) => {
                const Icon = insurance.icon;
                return (
                  <Card key={insurance.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-lg bg-${insurance.color}-50`}
                        >
                          <Icon className={`h-5 w-5 text-${insurance.color}-600`} />
                        </div>
                        <Badge
                          variant={
                            insurance.status === 'active'
                              ? 'default'
                              : 'secondary'
                          }
                          className={
                            insurance.status === 'active'
                              ? 'bg-green-50 text-green-700 hover:bg-green-50'
                              : 'bg-orange-50 text-orange-700 hover:bg-orange-50'
                          }
                        >
                          {insurance.status === 'active' ? '● Active' : '● Paused'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${insurance.amount.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {insurance.type}
                          </p>
                        </div>
                        <div className="flex -space-x-2">
                          {insurance.users.map((user, idx) => (
                            <div
                              key={idx}
                              className="h-8 w-8 rounded-full border-2 border-white bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium"
                            >
                              {user.name.charAt(0)}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold">
                    Policy & Claims
                  </CardTitle>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-blue-600"></div>
                      <span className="text-sm text-gray-600">Earnings</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-gray-600">Investment</span>
                    </div>
                  </div>
                </div>
                <Tabs
                  value={timePeriod}
                  onValueChange={setTimePeriod}
                  className="w-auto"
                >
                  <TabsList className="bg-gray-100">
                    <TabsTrigger value="daily" className="text-xs">
                      Daily
                    </TabsTrigger>
                    <TabsTrigger value="weekly" className="text-xs">
                      Weekly
                    </TabsTrigger>
                    <TabsTrigger value="monthly" className="text-xs">
                      Monthly
                    </TabsTrigger>
                    <TabsTrigger value="yearly" className="text-xs">
                      Yearly
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <div className="flex h-full items-end justify-between gap-2">
                  {chartData.map((data, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                      <div className="w-full flex items-end justify-center gap-1 h-48">
                        <div
                          className="w-full bg-blue-600 rounded-t-md transition-all hover:opacity-80"
                          style={{
                            height: `${(data.earnings / maxValue) * 100}%`,
                            minHeight: '8px',
                          }}
                        ></div>
                        <div
                          className="w-full bg-orange-500 rounded-t-md transition-all hover:opacity-80"
                          style={{
                            height: `${(data.investment / maxValue) * 100}%`,
                            minHeight: '8px',
                          }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-500">{data.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Transaction
              </h2>
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                See All
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Insurance Type</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">
                          {transaction.id}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center">
                              <Shield className="h-4 w-4 text-blue-600" />
                            </div>
                            {transaction.type}
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.paymentMethod}
                        </TableCell>
                        <TableCell className="font-semibold">
                          ${transaction.amount.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {transaction.date}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              transaction.status === 'completed'
                                ? 'bg-green-50 text-green-700'
                                : transaction.status === 'pending'
                                ? 'bg-orange-50 text-orange-700'
                                : 'bg-red-50 text-red-700'
                            }
                          >
                            {transaction.status === 'completed' && '● Completed'}
                            {transaction.status === 'pending' && '● Pending'}
                            {transaction.status === 'failed' && '● Failed'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">My Bills</h2>
              <Button variant="link" className="text-blue-600 p-0 h-auto">
                Pay Now
                <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-3">
              {bills.map((bill) => (
                <Card key={bill.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {bill.description}
                        </p>
                        <p className="text-xs text-gray-500">
                          Bill due date: {bill.dueDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">
                        ${bill.amount}
                      </p>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Pay Now
                        <ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                <div>
                  <p className="text-sm text-gray-600">Total Coverage</p>
                  <p className="text-xl font-bold text-gray-900">$8,082</p>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-medium">12%</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                <div>
                  <p className="text-sm text-gray-600">Active Policies</p>
                  <p className="text-xl font-bold text-gray-900">3</p>
                </div>
                <div className="flex items-center gap-1 text-blue-600">
                  <span className="text-sm font-medium">All Active</span>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                <div>
                  <p className="text-sm text-gray-600">Pending Bills</p>
                  <p className="text-xl font-bold text-gray-900">$1,500</p>
                </div>
                <div className="flex items-center gap-1 text-orange-600">
                  <TrendingDown className="h-4 w-4" />
                  <span className="text-sm font-medium">3 Bills</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
