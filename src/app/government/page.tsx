'use client';

import Link from 'next/link';
import { 
  Building2, 
  BarChart3, 
  FileText, 
  Shield,
  Users,
  Truck,
  Leaf,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Clock,
  MapPin,
  Download,
  Settings,
  Bell
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const mockData = {
  cityStats: {
    totalWasteCollected: 45680,
    wasteCollectedToday: 1234,
    recyclingRate: 78.5,
    citizenTrainingCompletion: 92.3,
    activeWorkers: 456,
    totalReports: 1892,
    environmentalScore: 8.7,
    policyCompliance: 94.2
  },
  alerts: [
    {
      id: 1,
      type: 'urgent',
      title: 'High Waste Accumulation',
      location: 'Commercial Street Area',
      time: '2 hours ago',
      status: 'pending'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Collection Delay',
      location: 'Residential Zone B',
      time: '4 hours ago',
      status: 'in-progress'
    },
    {
      id: 3,
      type: 'info',
      title: 'Training Milestone Reached',
      location: 'City Wide',
      time: '1 day ago',
      status: 'completed'
    }
  ],
  recentPolicies: [
    {
      id: 1,
      title: 'Plastic Ban Implementation',
      status: 'active',
      compliance: 87,
      lastUpdated: '2024-01-15'
    },
    {
      id: 2,
      title: 'E-Waste Collection Guidelines',
      status: 'draft',
      compliance: null,
      lastUpdated: '2024-01-10'
    },
    {
      id: 3,
      title: 'Organic Waste Composting Mandate',
      status: 'active',
      compliance: 94,
      lastUpdated: '2024-01-08'
    }
  ]
};

export default function GovernmentDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Government Portal</h1>
          <p className="text-lg text-gray-600">
            City administration dashboard for environmental policy and waste management oversight
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
          <Button size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Alerts ({mockData.alerts.filter(a => a.status === 'pending').length})
          </Button>
        </div>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/government/overview" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-blue-200 hover:border-blue-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">City Overview</CardTitle>
                  <CardDescription>Real-time city monitoring</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Waste Collected Today</p>
                  <p className="font-semibold text-lg">{mockData.cityStats.wasteCollectedToday.toLocaleString()} kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Environmental Score</p>
                  <p className="font-semibold text-lg text-green-600">{mockData.cityStats.environmentalScore}/10</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/government/policy" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-purple-200 hover:border-purple-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <Shield className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Policy Tools</CardTitle>
                  <CardDescription>Manage environmental policies</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Active Policies</p>
                  <p className="font-semibold text-lg">{mockData.recentPolicies.filter(p => p.status === 'active').length}</p>
                </div>
                <div>
                  <p className="text-gray-500">Avg Compliance</p>
                  <p className="font-semibold text-lg text-green-600">{mockData.cityStats.policyCompliance}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/government/audit" className="block">
          <Card className="hover:shadow-lg transition-all duration-300 border-orange-200 hover:border-orange-400 group">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Audit Reports</CardTitle>
                  <CardDescription>Compliance and analytics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Total Reports</p>
                  <p className="font-semibold text-lg">{mockData.cityStats.totalReports.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-gray-500">Recycling Rate</p>
                  <p className="font-semibold text-lg text-green-600">{mockData.cityStats.recyclingRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Waste Collection</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockData.cityStats.totalWasteCollected.toLocaleString()}</p>
                <p className="text-sm text-gray-500">kg collected this month</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">+12% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Citizen Training</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockData.cityStats.citizenTrainingCompletion}%</p>
                <p className="text-sm text-gray-500">completion rate</p>
              </div>
              <Progress value={mockData.cityStats.citizenTrainingCompletion} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Recycling Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockData.cityStats.recyclingRate}%</p>
                <p className="text-sm text-gray-500">of total waste</p>
              </div>
              <Progress value={mockData.cityStats.recyclingRate} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Environmental Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-2xl font-bold">{mockData.cityStats.environmentalScore}/10</p>
                <p className="text-sm text-gray-500">city sustainability index</p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Excellent performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              Recent Alerts
            </CardTitle>
            <CardDescription>Real-time system notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.alerts.map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.type === 'urgent' ? 'bg-red-500' :
                    alert.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{alert.title}</h4>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {alert.location}
                        </p>
                      </div>
                      <Badge variant={
                        alert.status === 'pending' ? 'destructive' :
                        alert.status === 'in-progress' ? 'default' : 'secondary'
                      }>
                        {alert.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Alerts
            </Button>
          </CardContent>
        </Card>

        {/* Recent Policies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-purple-500" />
              Recent Policies
            </CardTitle>
            <CardDescription>Latest environmental policies and their compliance status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockData.recentPolicies.map((policy) => (
                <div key={policy.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium">{policy.title}</h4>
                    <Badge variant={policy.status === 'active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                  </div>
                  {policy.compliance && (
                    <div className="mb-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Compliance Rate</span>
                        <span>{policy.compliance}%</span>
                      </div>
                      <Progress value={policy.compliance} className="h-2" />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Last updated: {policy.lastUpdated}
                  </p>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              Manage All Policies
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common administrative tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <FileText className="w-5 h-5" />
              Generate Report
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Shield className="w-5 h-5" />
              Create Policy
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Users className="w-5 h-5" />
              Manage Users
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2">
              <Settings className="w-5 h-5" />
              System Settings
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}