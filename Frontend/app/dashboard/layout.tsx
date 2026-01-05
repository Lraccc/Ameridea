'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BarChart3,
  Shield,
  FileText,
  FileBarChart,
  Settings,
  HelpCircle,
  Search,
  ChevronDown,
  Menu,
  X,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { apiService } from '@/lib/api-service';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'My Insurance', href: '/dashboard/insurance', icon: Shield },
  { name: 'Bill', href: '/dashboard/bill', icon: FileText, badge: 3 },
  { name: 'Reports', href: '/dashboard/reports', icon: FileBarChart },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Get Help', href: '/dashboard/help', icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);

  useEffect(() => {
    // Check if user is authenticated using new auth system
    const authToken = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");
    
    if (!authToken) {
      router.push("/login");
    } else if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [router]);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside
        className={cn(
          'fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-gray-200 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-6">
            <div className="flex items-center">
              <img src="/images/ameridea-logo.png" alt="" className="h-10 w-auto" style={{maxWidth: 140}} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6">
            <nav className="space-y-1 px-3">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors relative',
                      isActive
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                    {item.badge && (
                      <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Advertisement Slideshow Placeholder */}
            <div className="px-3 mt-6">
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="aspect-[4/3] flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="text-3xl mb-2">📢</div>
                    <p className="text-xs font-medium text-blue-700">Advertisement</p>
                    <p className="text-xs text-blue-600 mt-1">Slideshow placeholder</p>
                  </div>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-300"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              {sidebarOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search anything"
                className="w-full pl-9 pr-4 bg-gray-50 border-gray-200"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-gray-200 bg-white px-1.5 font-mono text-[10px] font-medium text-gray-600">
                  ⌘K
                </kbd>
              </div>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 rounded-lg p-2 hover:bg-gray-50">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="" alt={user?.fullName || 'User'} />
                  <AvatarFallback className="bg-blue-600 text-white">
                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || ''}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 flex-shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.fullName || 'User'}</p>
                  <p className="text-xs text-gray-500">
                    {user?.email || ''}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Billing</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="p-6">{children}</main>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
