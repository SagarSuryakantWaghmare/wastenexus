'use client';

import { useState, useEffect } from 'react';
import UserAvatar from '@/components/UserAvatar';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// Tabs were not used; remove unused import to satisfy lint rules
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Users,
  Search,
  Shield,
  Mail,
  Award,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { PageLoader, LoaderCircle } from '@/components/ui/loader';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'champion' | 'admin';
  totalPoints: number;
  createdAt: string;
  profileImage?: string;
}

export default function UserManagementPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{id: string, name: string} | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmDelete = (userId: string, userName: string) => {
    setUserToDelete({ id: userId, name: userName });
    setShowDeleteDialog(true);
  };

  const deleteUser = async () => {
    if (!userToDelete) return;
    
    try {
      setDeletingUserId(userToDelete.id);
      const response = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userId: userToDelete.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Refresh the user list
      await fetchUsers();
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete user');
    } finally {
      setDeletingUserId(null);
      setShowDeleteDialog(false);
      setUserToDelete(null);
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  // First filter by search query across all users
  const searchFilteredUsers = searchQuery.trim() === '' 
    ? users 
    : users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
      );

  // Then filter by active tab
  const filteredUsers = activeTab === 'all'
    ? searchFilteredUsers
    : searchFilteredUsers.filter((user) => user.role === activeTab);

  const roleStats = {
    all: users.length,
    client: users.filter((u) => u.role === 'client').length,
    champion: users.filter((u) => u.role === 'champion').length,
    admin: users.filter((u) => u.role === 'admin').length,
  };

  // Calculate percentages for the distribution chart
  const totalUsers = roleStats.all || 1; // Avoid division by zero
  const clientPercentage = (roleStats.client / totalUsers) * 100;
  const championPercentage = (roleStats.champion / totalUsers) * 100;
  const adminPercentage = (roleStats.admin / totalUsers) * 100;

  // Mock data for growth/decline indicators
  const growthData = {
    all: { value: Math.floor(Math.random() * 15) + 5, isPositive: Math.random() > 0.3 },
    client: { value: Math.floor(Math.random() * 12) + 3, isPositive: Math.random() > 0.3 },
    champion: { value: Math.floor(Math.random() * 8) + 2, isPositive: Math.random() > 0.4 },
    admin: { value: Math.floor(Math.random() * 5) + 1, isPositive: Math.random() > 0.2 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <PageLoader message="Loading users..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
        {/* Modern Header Card */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="p-6 sm:p-8 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    User Management
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage users, roles, and permissions across the platform
                  </p>
                </div>
              </div>
              
              {/* Time Range Filter */}
              <div className="flex items-center gap-1 bg-white dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                {['all', 'today', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 whitespace-nowrap ${
                      timeRange === period
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

        {/* Stats Overview - Modern Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{roleStats.all.toLocaleString()}</p>
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center font-semibold ${growthData.all.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {growthData.all.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      {growthData.all.value}%
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Active Clients</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{roleStats.client.toLocaleString()}</p>
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center font-semibold ${growthData.client.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {growthData.client.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      {growthData.client.value}%
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <Mail className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Champions</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{roleStats.champion.toLocaleString()}</p>
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center font-semibold ${growthData.champion.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {growthData.champion.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      {growthData.champion.value}%
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl shadow-lg">
                  <Award className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md hover:shadow-xl transition-all duration-200 rounded-xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Admin Users</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{roleStats.admin.toLocaleString()}</p>
                  <div className="flex items-center text-xs">
                    <span className={`flex items-center font-semibold ${growthData.admin.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {growthData.admin.isPositive ? (
                        <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
                      )}
                      {growthData.admin.value}%
                    </span>
                    <span className="ml-1 text-gray-500 dark:text-gray-400">from last {timeRange}</span>
                  </div>
                </div>
                <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Shield className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl">
          <CardHeader className="pb-4 p-6">
            <CardTitle className="text-lg font-bold text-gray-900 dark:text-white">User Distribution</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of user roles and their distribution</p>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-4 shadow-inner">
              <div className="h-full flex">
                <div 
                  className="bg-blue-500 transition-all duration-500" 
                  style={{ width: `${clientPercentage}%` }}
                  title={`${clientPercentage.toFixed(1)}% Clients`}
                ></div>
                <div 
                  className="bg-amber-500 transition-all duration-500" 
                  style={{ width: `${championPercentage}%` }}
                  title={`${championPercentage.toFixed(1)}% Champions`}
                ></div>
                <div 
                  className="bg-purple-500 transition-all duration-500" 
                  style={{ width: `${adminPercentage}%` }}
                  title={`${adminPercentage.toFixed(1)}% Admins`}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Clients</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{roleStats.client}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {clientPercentage.toFixed(1)}% of total
                  </span>
                  <span className={`text-xs font-medium ${growthData.client.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {growthData.client.isPositive ? '+' : ''}{growthData.client.value}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Champions</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{roleStats.champion}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {championPercentage.toFixed(1)}% of total
                  </span>
                  <span className={`text-xs font-medium ${growthData.champion.isPositive ? 'text-amber-500 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                    {growthData.champion.isPositive ? '+' : ''}{growthData.champion.value}%
                  </span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Admins</span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">{roleStats.admin}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {adminPercentage.toFixed(1)}% of total
                  </span>
                  <span className={`text-xs font-medium ${growthData.admin.isPositive ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'}`}>
                    {growthData.admin.isPositive ? '+' : ''}{growthData.admin.value}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500 z-10" />
                <Input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  className="pl-12 pr-12 h-12 w-full bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 shadow-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                    aria-label="Clear search"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
              
              {/* Filter Tabs - Fully Responsive */}
              <div className="grid w-full grid-cols-2 sm:grid-cols-4 bg-gray-100 dark:bg-gray-700/50 p-1.5 rounded-xl border border-gray-200 dark:border-gray-600 gap-1.5">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`${
                    activeTab === 'all'
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } text-xs sm:text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0`}
                >
                  <span className="truncate">All Users</span>
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[24px] justify-center">
                    {roleStats.all}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab('client')}
                  className={`${
                    activeTab === 'client'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } text-xs sm:text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0`}
                >
                  <span className="truncate">Clients</span>
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[24px] justify-center">
                    {roleStats.client}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab('champion')}
                  className={`${
                    activeTab === 'champion'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } text-xs sm:text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0`}
                >
                  <span className="truncate">Champions</span>
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[24px] justify-center">
                    {roleStats.champion}
                  </Badge>
                </button>
                <button
                  onClick={() => setActiveTab('admin')}
                  className={`${
                    activeTab === 'admin'
                      ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  } text-xs sm:text-sm font-semibold px-2 sm:px-4 py-2.5 rounded-lg transition-all flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 min-w-0`}
                >
                  <span className="truncate">Admins</span>
                  <Badge variant="secondary" className="bg-white/90 dark:bg-gray-800/90 text-[10px] sm:text-xs px-1.5 py-0.5 min-w-[24px] justify-center">
                    {roleStats.admin}
                  </Badge>
                </button>
              </div>

              {/* Search Results Info */}
              {searchQuery && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></div>
                    <span className="text-gray-700 dark:text-gray-300">
                      Found <span className="font-bold text-green-700 dark:text-green-400">{filteredUsers.length}</span> {filteredUsers.length === 1 ? 'user' : 'users'} matching <span className="font-semibold text-gray-900 dark:text-white">&quot;{searchQuery}&quot;</span>
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery('')}
                    className="text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg font-medium self-start sm:self-auto"
                  >
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-700">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 shadow-md"></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Clients</span>
                </div>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {clientPercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 shadow-md"></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Champions</span>
                </div>
                <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  {championPercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-700">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 shadow-md"></div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Admins</span>
                </div>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {adminPercentage.toFixed(1)}%
                </span>
              </div>
            </div>

        {/* Users Directory */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md rounded-xl">
          <CardHeader className="pb-4 p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white mb-1">User Directory</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredUsers.length}</span> of <span className="font-semibold text-gray-900 dark:text-white">{users.length}</span> users
                </p>
              </div>
              <div className="text-right">
                <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {filteredUsers.length}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activeTab === 'all' ? 'Total Users' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1) + 's'}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              {filteredUsers.length === 0 ? (
                    <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                      <div className="mx-auto w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                        <Users className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                      </div>
                      <p className="text-lg font-medium text-gray-900 dark:text-white mb-1">No users found</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {searchQuery ? `No users match "${searchQuery}"` : 'No users in this category'}
                      </p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 sm:p-5 bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-800/50 dark:via-gray-700/30 dark:to-gray-800/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] overflow-hidden"
                      >
                        {/* Decorative gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* User Info Section */}
                        <div className="relative flex items-center gap-3 sm:gap-4 min-w-0 flex-1 w-full sm:w-auto">
                          {user.profileImage ? (
                            <UserAvatar
                              name={user.name}
                              profileImage={user.profileImage}
                              size="md"
                              className="ring-2 ring-offset-2 ring-green-400 dark:ring-green-500 border-2 border-white dark:border-gray-800 flex-shrink-0 shadow-lg"
                            />
                          ) : (
                            <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0 ${
                              user.role === 'admin'
                                ? 'bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700'
                                : user.role === 'champion'
                                ? 'bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700'
                                : 'bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700'
                            }`}>
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-1.5">
                              <h3 className="font-bold text-base sm:text-lg text-gray-900 dark:text-white truncate">
                                {user.name}
                              </h3>
                              {user.role === 'admin' && (
                                <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                  <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400 flex-shrink-0" />
                                </div>
                              )}
                              {user.role === 'champion' && (
                                <div className="p-1 bg-amber-100 dark:bg-amber-900/30 rounded-md">
                                  <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                              <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                              <p className="truncate max-w-[200px] sm:max-w-none">{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        {/* Actions Section */}
                        <div className="relative flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto ml-0 sm:ml-auto">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <Badge
                              variant="outline"
                              className={`text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm whitespace-nowrap ${
                                user.role === 'admin'
                                  ? 'border-purple-300 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-900/50 dark:border-purple-500'
                                  : user.role === 'champion'
                                  ? 'border-amber-300 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/50 dark:border-amber-500'
                                  : 'border-blue-300 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/50 dark:border-blue-500'
                              }`}
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                            <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg border border-green-200 dark:border-green-700 shadow-sm">
                              <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse"></div>
                              <span className="font-bold text-sm text-gray-900 dark:text-white">{user.totalPoints.toLocaleString()}</span>
                              <span className="text-[10px] sm:text-xs text-gray-600 dark:text-gray-400">pts</span>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all rounded-xl h-10 w-10 sm:h-11 sm:w-11 flex-shrink-0 shadow-sm hover:shadow-lg"
                            onClick={() => confirmDelete(user._id, user.name)}
                            disabled={deletingUserId === user._id}
                            title="Delete user"
                          >
                            {deletingUserId === user._id ? (
                              <LoaderCircle size="sm" className="inline-block" />
                            ) : (
                              <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-gray-900 dark:text-white">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600 dark:text-gray-300">
              This action cannot be undone. This will permanently delete the user 
              <span className="font-semibold text-gray-900 dark:text-white"> {userToDelete?.name}</span> and all their data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-3">
            <AlertDialogCancel 
              disabled={!!deletingUserId}
              className="mt-0 border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteUser}
              className="bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-600"
              disabled={!!deletingUserId}
            >
              {deletingUserId ? (
                <>
                  <LoaderCircle size="sm" className="mr-2" />
                  Deleting...
                </>
              ) : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
