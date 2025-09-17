'use client';

import { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Search, 
  Filter, 
  Download, 
  Edit3, 
  Eye, 
  Ban, 
  CheckCircle, 
  Clock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  MoreHorizontal,
  Shield,
  Award,
  Briefcase,
  Home
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockUsersData = {
  stats: {
    totalUsers: 125000,
    activeUsers: 98500,
    newUsersToday: 234,
    suspendedUsers: 156,
    pendingApproval: 45,
    verifiedUsers: 120000
  },
  users: [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul.sharma@email.com',
      phone: '+91 98765 43210',
      role: 'citizen',
      status: 'active',
      location: 'Mumbai, Maharashtra',
      joinDate: '2024-01-15',
      lastActive: '2 hours ago',
      trainingProgress: 85,
      greenCredits: 450,
      avatar: null,
      verified: true
    },
    {
      id: 2,
      name: 'Priya Singh',
      email: 'priya.singh@email.com',
      phone: '+91 87654 32109',
      role: 'green_champion',
      status: 'active',
      location: 'Delhi, India',
      joinDate: '2023-11-20',
      lastActive: '1 hour ago',
      trainingProgress: 100,
      greenCredits: 1250,
      avatar: null,
      verified: true
    },
    {
      id: 3,
      name: 'Amit Kumar',
      email: 'amit.kumar@email.com',
      phone: '+91 76543 21098',
      role: 'worker',
      status: 'active',
      location: 'Bangalore, Karnataka',
      joinDate: '2024-01-10',
      lastActive: '30 minutes ago',
      trainingProgress: 90,
      greenCredits: 320,
      avatar: null,
      verified: true
    },
    {
      id: 4,
      name: 'Sneha Patel',
      email: 'sneha.patel@email.com',
      phone: '+91 65432 10987',
      role: 'citizen',
      status: 'pending',
      location: 'Pune, Maharashtra',
      joinDate: '2024-01-18',
      lastActive: 'Never',
      trainingProgress: 0,
      greenCredits: 0,
      avatar: null,
      verified: false
    },
    {
      id: 5,
      name: 'Rajesh Gupta',
      email: 'rajesh.gupta@email.com',
      phone: '+91 54321 09876',
      role: 'admin',
      status: 'active',
      location: 'Chennai, Tamil Nadu',
      joinDate: '2023-08-15',
      lastActive: '5 minutes ago',
      trainingProgress: 100,
      greenCredits: 800,
      avatar: null,
      verified: true
    },
    {
      id: 6,
      name: 'Meera Yadav',
      email: 'meera.yadav@email.com',
      phone: '+91 43210 98765',
      role: 'citizen',
      status: 'suspended',
      location: 'Kolkata, West Bengal',
      joinDate: '2023-12-05',
      lastActive: '1 week ago',
      trainingProgress: 45,
      greenCredits: 120,
      avatar: null,
      verified: true
    }
  ],
  recentActivities: [
    {
      id: 1,
      user: 'Rahul Sharma',
      action: 'Completed training module',
      time: '5 minutes ago',
      type: 'training'
    },
    {
      id: 2,
      user: 'Priya Singh',
      action: 'Reported waste issue',
      time: '15 minutes ago',
      type: 'report'
    },
    {
      id: 3,
      user: 'Amit Kumar',
      action: 'Updated collection route',
      time: '1 hour ago',
      type: 'work'
    },
    {
      id: 4,
      user: 'New User',
      action: 'Account created',
      time: '2 hours ago',
      type: 'registration'
    }
  ]
};

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="w-4 h-4" />;
      case 'green_champion': return <Award className="w-4 h-4" />;
      case 'worker': return <Briefcase className="w-4 h-4" />;
      case 'citizen': return <Home className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800 border-red-200';
      case 'green_champion': return 'bg-green-100 text-green-800 border-green-200';
      case 'worker': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'citizen': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredUsers = mockUsersData.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">User Management</h1>
          <p className="text-lg text-gray-600">
            Manage and monitor all users across the platform
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Users
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account manually
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <Input placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input type="email" placeholder="Enter email address" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <Input placeholder="Enter phone number" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select className="w-full p-2 border rounded">
                    <option value="citizen">Citizen</option>
                    <option value="worker">Worker</option>
                    <option value="green_champion">Green Champion</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">Create User</Button>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-xl font-bold">{(mockUsersData.stats.totalUsers / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold">{(mockUsersData.stats.activeUsers / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">New Today</p>
                <p className="text-xl font-bold">{mockUsersData.stats.newUsersToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-bold">{mockUsersData.stats.pendingApproval}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Suspended</p>
                <p className="text-xl font-bold">{mockUsersData.stats.suspendedUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Verified</p>
                <p className="text-xl font-bold">{(mockUsersData.stats.verifiedUsers / 1000).toFixed(0)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Management Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Users</TabsTrigger>
          <TabsTrigger value="pending">Pending Approval</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">User Analytics</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Roles</option>
              <option value="citizen">Citizens</option>
              <option value="worker">Workers</option>
              <option value="green_champion">Green Champions</option>
              <option value="admin">Admins</option>
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <TabsContent value="all" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>Comprehensive list of all platform users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{user.name}</h4>
                        {user.verified && <CheckCircle className="w-4 h-4 text-green-500" />}
                        <Badge className={getRoleColor(user.role)}>
                          <div className="flex items-center gap-1">
                            {getRoleIcon(user.role)}
                            {user.role.replace('_', ' ')}
                          </div>
                        </Badge>
                        <Badge className={getStatusColor(user.status)}>
                          {user.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {user.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {user.phone}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {user.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Joined {user.joinDate}
                        </div>
                      </div>
                      
                      {user.role === 'citizen' || user.role === 'green_champion' ? (
                        <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                          <div>
                            <span className="text-gray-500">Training: </span>
                            <span className="font-medium">{user.trainingProgress}%</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Green Credits: </span>
                            <span className="font-medium">{user.greenCredits}</span>
                          </div>
                        </div>
                      ) : null}
                      
                      <p className="text-xs text-gray-500 mt-1">
                        Last active: {user.lastActive}
                      </p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      {user.status === 'active' ? (
                        <Button variant="ghost" size="sm">
                          <Ban className="w-4 h-4" />
                        </Button>
                      ) : user.status === 'suspended' ? (
                        <Button variant="ghost" size="sm">
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      ) : null}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Approvals</CardTitle>
              <CardDescription>Users awaiting account verification and approval</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredUsers.filter(user => user.status === 'pending').map((user) => (
                  <div key={user.id} className="flex items-center gap-4 p-4 border rounded-lg bg-yellow-50">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{user.name}</h4>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">Applied on {user.joinDate}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="outline" size="sm">
                        <Ban className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent User Activities</CardTitle>
              <CardDescription>Latest user actions and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockUsersData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'training' ? 'bg-green-500' :
                      activity.type === 'report' ? 'bg-blue-500' :
                      activity.type === 'work' ? 'bg-purple-500' : 'bg-yellow-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                    </div>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600">+15.2%</p>
                  <p className="text-gray-600">Monthly growth rate</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">+2,890 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-medium">+2,456 users</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Retention Rate</span>
                    <span className="font-medium text-green-600">92.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Role Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Citizens</span>
                    <span className="font-medium">78.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Workers</span>
                    <span className="font-medium">15.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Green Champions</span>
                    <span className="font-medium">5.6%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Admins</span>
                    <span className="font-medium">0.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}