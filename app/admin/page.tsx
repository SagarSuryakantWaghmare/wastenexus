'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Settings, 
  BarChart3, 
  Users, 
  FileText, 
  Shield,
  Database,
  Activity,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  Server,
  Globe,
  UserCheck,
  UserX,
  Download,
  Upload,
  RefreshCw,
  Bell,
  Search,
  Filter,
  Calendar,
  Eye
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';

const mockAdminData = {
  systemStats: {
    totalUsers: 125000,
    activeUsers: 89500,
    newUsersToday: 234,
    systemUptime: 99.97,
    apiRequests: 1250000,
    dataStorage: 78.5,
    serverLoad: 34.2,
    responseTime: 185
  },
  userBreakdown: {
    citizens: 98500,
    workers: 1250,
    greenChampions: 890,
    admins: 45,
    suspended: 156,
    pending: 320
  },
  recentActivities: [
    {
      id: 1,
      type: 'user_created',
      message: 'New citizen registered: Priya Sharma',
      time: '2 minutes ago',
      severity: 'info'
    },
    {
      id: 2,
      type: 'system_alert',
      message: 'High API usage detected in Mumbai region',
      time: '15 minutes ago',
      severity: 'warning'
    },
    {
      id: 3,
      type: 'policy_update',
      message: 'Plastic ban policy updated by Government Admin',
      time: '1 hour ago',
      severity: 'info'
    },
    {
      id: 4,
      type: 'security',
      message: 'Failed login attempts from suspicious IP',
      time: '2 hours ago',
      severity: 'error'
    },
    {
      id: 5,
      type: 'performance',
      message: 'Database optimization completed successfully',
      time: '3 hours ago',
      severity: 'success'
    }
  ],
  criticalAlerts: [
    {
      id: 1,
      title: 'Server Maintenance Required',
      description: 'Database server needs maintenance in 48 hours',
      priority: 'high',
      time: '1 hour ago'
    },
    {
      id: 2,
      title: 'Storage Approaching Limit',
      description: 'Data storage at 78.5% capacity',
      priority: 'medium',
      time: '3 hours ago'
    },
    {
      id: 3,
      title: 'Security Scan Complete',
      description: 'No vulnerabilities detected in latest scan',
      priority: 'low',
      time: '6 hours ago'
    }
  ],
  quickStats: {
    wasteReportsToday: 1456,
    trainingCompletions: 892,
    policiesActive: 23,
    systemHealth: 94.5
  }
};

export default function AdminDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('today');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-lg text-gray-600">
            Comprehensive system administration and monitoring dashboard
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts ({mockAdminData.criticalAlerts.filter(a => a.priority === 'high').length})
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/analytics" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 hover:border-blue-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Analytics</CardTitle>
                  <CardDescription>System performance metrics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">API Requests</p>
                  <p className="font-semibold text-lg">{(mockAdminData.systemStats.apiRequests / 1000000).toFixed(1)}M</p>
                </div>
                <div>
                  <p className="text-gray-500">Response Time</p>
                  <p className="font-semibold text-lg text-green-600">{mockAdminData.systemStats.responseTime}ms</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 hover:border-purple-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">User Management</CardTitle>
                  <CardDescription>Manage all user accounts</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Users</p>
                  <p className="font-semibold text-lg">{(mockAdminData.systemStats.totalUsers / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-gray-500">Active Today</p>
                  <p className="font-semibold text-lg text-green-600">{(mockAdminData.systemStats.activeUsers / 1000).toFixed(1)}K</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reports" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-green-200 hover:border-green-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Reports</CardTitle>
                  <CardDescription>System and user reports</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Reports Today</p>
                  <p className="font-semibold text-lg">{mockAdminData.quickStats.wasteReportsToday}</p>
                </div>
                <div>
                  <p className="text-gray-500">Completions</p>
                  <p className="font-semibold text-lg text-green-600">{mockAdminData.quickStats.trainingCompletions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/settings" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-orange-200 hover:border-orange-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Settings</CardTitle>
                  <CardDescription>System configuration</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Uptime</p>
                  <p className="font-semibold text-lg text-green-600">{mockAdminData.systemStats.systemUptime}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Health Score</p>
                  <p className="font-semibold text-lg text-green-600">{mockAdminData.quickStats.systemHealth}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Total Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockAdminData.systemStats.totalUsers.toLocaleString()}</p>
                <p className="text-sm text-gray-500">registered users</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+{mockAdminData.systemStats.newUsersToday} today</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">System Health</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockAdminData.quickStats.systemHealth}%</p>
                <p className="text-sm text-gray-500">overall health</p>
              </div>
              <Progress value={mockAdminData.quickStats.systemHealth} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Storage Usage</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockAdminData.systemStats.dataStorage}%</p>
                <p className="text-sm text-gray-500">of total capacity</p>
              </div>
              <Progress value={mockAdminData.systemStats.dataStorage} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Server Load</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockAdminData.systemStats.serverLoad}%</p>
                <p className="text-sm text-gray-500">current load</p>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Optimal performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* User Distribution and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              User Distribution
            </CardTitle>
            <CardDescription>Breakdown of user types across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-sm">Citizens</span>
                </div>
                <span className="font-semibold">{mockAdminData.userBreakdown.citizens.toLocaleString()}</span>
              </div>
              <Progress value={(mockAdminData.userBreakdown.citizens / mockAdminData.systemStats.totalUsers) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span className="text-sm">Workers</span>
                </div>
                <span className="font-semibold">{mockAdminData.userBreakdown.workers.toLocaleString()}</span>
              </div>
              <Progress value={(mockAdminData.userBreakdown.workers / mockAdminData.systemStats.totalUsers) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span className="text-sm">Green Champions</span>
                </div>
                <span className="font-semibold">{mockAdminData.userBreakdown.greenChampions.toLocaleString()}</span>
              </div>
              <Progress value={(mockAdminData.userBreakdown.greenChampions / mockAdminData.systemStats.totalUsers) * 100} className="h-2" />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                  <span className="text-sm">Admins</span>
                </div>
                <span className="font-semibold">{mockAdminData.userBreakdown.admins}</span>
              </div>
              <Progress value={(mockAdminData.userBreakdown.admins / mockAdminData.systemStats.totalUsers) * 100} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Recent System Activities
            </CardTitle>
            <CardDescription>Latest system events and user activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockAdminData.recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.severity === 'error' ? 'bg-red-500' :
                    activity.severity === 'warning' ? 'bg-yellow-500' :
                    activity.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {activity.time}
                    </p>
                  </div>
                  <Badge className={getSeverityColor(activity.severity)}>
                    {activity.severity}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Activities
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Critical Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            Critical Alerts
          </CardTitle>
          <CardDescription>System alerts requiring immediate attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAdminData.criticalAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start gap-4 p-4 border rounded-lg">
                <div className={`p-2 rounded-lg ${
                  alert.priority === 'high' ? 'bg-red-100' :
                  alert.priority === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                }`}>
                  {alert.priority === 'high' ? 
                    <AlertTriangle className="w-5 h-5 text-red-600" /> :
                    alert.priority === 'medium' ?
                    <Clock className="w-5 h-5 text-yellow-600" /> :
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  }
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                    </div>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority} priority
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and system operations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <UserCheck className="w-5 h-5" />
              Approve Users
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Database className="w-5 h-5" />
              Backup System
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Shield className="w-5 h-5" />
              Security Scan
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Download className="w-5 h-5" />
              Export Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}