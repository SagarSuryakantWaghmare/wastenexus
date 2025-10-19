'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Loader2,
  Mail,
  Award,
  Trash2,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'client' | 'champion' | 'admin';
  totalPoints: number;
  createdAt: string;
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

  const filteredUsers = users.filter(
    (user) =>
      (activeTab === 'all' || user.role === activeTab) &&
      (user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 dark:text-green-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with Time Range Selector */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                <Users className="w-8 h-8 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
                User Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 sm:mt-2 text-sm sm:text-base">
                Manage users, roles, and permissions
              </p>
            </div>
            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
              {['all', 'today', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimeRange(period)}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    timeRange === period
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{roleStats.all.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${growthData.all.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {growthData.all.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {growthData.all.value}% {growthData.all.isPositive ? 'growth' : 'decline'} from last {timeRange}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Active Clients</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{roleStats.client.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${growthData.client.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {growthData.client.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {growthData.client.value}% {growthData.client.isPositive ? 'growth' : 'decline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Champions</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{roleStats.champion.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${growthData.champion.isPositive ? 'text-amber-500 dark:text-amber-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {growthData.champion.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {growthData.champion.value}% {growthData.champion.isPositive ? 'growth' : 'decline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                  <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Admin Users</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{roleStats.admin.toLocaleString()}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className={`flex items-center ${growthData.admin.isPositive ? 'text-purple-600 dark:text-purple-400' : 'text-red-600 dark:text-red-400'} font-medium`}>
                      {growthData.admin.isPositive ? (
                        <ArrowUpRight className="w-4 h-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 mr-1" />
                      )}
                      {growthData.admin.value}% {growthData.admin.isPositive ? 'growth' : 'decline'}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Shield className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Distribution */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">User Distribution</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of user roles and their distribution</p>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                {['all', 'today', 'week', 'month'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setTimeRange(period)}
                    className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-colors ${
                      timeRange === period
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                    }`}
                  >
                    {period.charAt(0).toUpperCase() + period.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-6">
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

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search users..."
              className="pl-10 w-full bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
              <TabsTrigger 
                value="all"
                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/50 dark:data-[state=active]:text-green-400"
              >
                All
              </TabsTrigger>
              <TabsTrigger 
                value="client"
                className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/50 dark:data-[state=active]:text-blue-400"
              >
                Clients
              </TabsTrigger>
              <TabsTrigger 
                value="champion"
                className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/50 dark:data-[state=active]:text-amber-400"
              >
                Champions
              </TabsTrigger>
              <TabsTrigger 
                value="admin"
                className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-400"
              >
                Admins
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Clients Card */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Clients</span>
            </div>
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {roleStats.all > 0 ? ((roleStats.client / roleStats.all) * 100).toFixed(1) : 0}%
            </span>
          </div>
          
          {/* Champions Card */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-3"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Champions</span>
            </div>
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {roleStats.all > 0 ? ((roleStats.champion / roleStats.all) * 100).toFixed(1) : 0}%
            </span>
          </div>
          
          {/* Admins Card */}
          <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-3"></div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admins</span>
            </div>
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {roleStats.all > 0 ? ((roleStats.admin / roleStats.all) * 100).toFixed(1) : 0}%
            </span>
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">All Users</CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage user accounts and permissions</p>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-1">
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/50 dark:data-[state=active]:text-green-400"
                >
                  All ({roleStats.all})
                </TabsTrigger>
                <TabsTrigger 
                  value="client"
                  className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/50 dark:data-[state=active]:text-blue-400"
                >
                  Clients ({roleStats.client})
                </TabsTrigger>
                <TabsTrigger 
                  value="champion"
                  className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-700 dark:data-[state=active]:bg-amber-900/50 dark:data-[state=active]:text-amber-400"
                >
                  Champions ({roleStats.champion})
                </TabsTrigger>
                <TabsTrigger 
                  value="admin"
                  className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/50 dark:data-[state=active]:text-purple-400"
                >
                  Admins ({roleStats.admin})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-3">
                  {filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p>No users found</p>
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200 font-bold text-lg border border-gray-200 dark:border-gray-600">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <Badge
                              variant="outline"
                              className={
                                user.role === 'admin'
                                  ? 'border-purple-500 text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
                                  : user.role === 'champion'
                                  ? 'border-amber-500 text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                                  : 'border-blue-500 text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              }
                            >
                              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                            </Badge>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {user.totalPoints} points
                            </p>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => confirmDelete(user._id, user.name)}
                            disabled={deletingUserId === user._id}
                          >
                            {deletingUserId === user._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
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
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
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
