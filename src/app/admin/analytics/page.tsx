'use client';

import { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Activity, 
  Server, 
  Database, 
  Globe, 
  Zap, 
  Clock, 
  RefreshCw, 
  Download,
  AlertTriangle,
  CheckCircle,
  Cpu,
  HardDrive,
  Wifi,
  Battery
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockAnalyticsData = {
  realTimeMetrics: {
    activeUsers: 8950,
    apiRequestsPerMinute: 2340,
    responseTime: 185,
    errorRate: 0.02,
    throughput: 98.7,
    cpuUsage: 34.2,
    memoryUsage: 67.8,
    diskUsage: 78.5,
    networkLatency: 45
  },
  performanceData: {
    last24Hours: [
      { time: '00:00', users: 1200, requests: 1800, errors: 2 },
      { time: '04:00', users: 800, requests: 1200, errors: 1 },
      { time: '08:00', users: 4500, requests: 6800, errors: 8 },
      { time: '12:00', users: 8900, requests: 12400, errors: 15 },
      { time: '16:00', users: 7200, requests: 10800, errors: 12 },
      { time: '20:00', users: 5600, requests: 8400, errors: 6 }
    ]
  },
  userEngagement: {
    dailyActiveUsers: 89500,
    monthlyActiveUsers: 245000,
    sessionDuration: 24.5,
    bounceRate: 12.3,
    pageViews: 567000,
    uniqueVisitors: 123000
  },
  systemHealth: {
    uptime: 99.97,
    totalRequests: 12450000,
    successRate: 99.98,
    averageResponseTime: 185,
    peakConcurrentUsers: 12500,
    dataTransfer: 1250
  },
  geographicData: [
    { region: 'Mumbai', users: 25600, percentage: 28.6 },
    { region: 'Delhi', users: 22400, percentage: 25.1 },
    { region: 'Bangalore', users: 18900, percentage: 21.1 },
    { region: 'Chennai', users: 12300, percentage: 13.8 },
    { region: 'Kolkata', users: 8200, percentage: 9.2 },
    { region: 'Others', users: 2100, percentage: 2.2 }
  ],
  alerts: [
    {
      id: 1,
      type: 'performance',
      message: 'High memory usage detected on Server-2',
      severity: 'warning',
      time: '5 minutes ago'
    },
    {
      id: 2,
      type: 'security',
      message: 'Unusual API access pattern from Delhi region',
      severity: 'info',
      time: '12 minutes ago'
    },
    {
      id: 3,
      type: 'system',
      message: 'Database backup completed successfully',
      severity: 'success',
      time: '1 hour ago'
    }
  ]
};

export default function AnalyticsDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('24h');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-lg text-gray-600">
            Real-time system performance monitoring and user analytics
          </p>
        </div>
        <div className="flex gap-3">
          <select 
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Active Users</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockAnalyticsData.realTimeMetrics.activeUsers.toLocaleString()}</p>
              <p className="text-sm text-gray-600">currently online</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+5.2% from yesterday</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">API Requests</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockAnalyticsData.realTimeMetrics.apiRequestsPerMinute.toLocaleString()}</p>
              <p className="text-sm text-gray-600">requests/minute</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+12.3% peak traffic</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Response Time</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockAnalyticsData.realTimeMetrics.responseTime}ms</p>
              <p className="text-sm text-gray-600">average response</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-8ms improvement</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Success Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockAnalyticsData.systemHealth.successRate}%</p>
              <p className="text-sm text-gray-600">request success rate</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Excellent performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tabs */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="system">System Health</TabsTrigger>
          <TabsTrigger value="geographic">Geographic</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Server Performance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  Server Performance
                </CardTitle>
                <CardDescription>Real-time server resource utilization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-blue-500" />
                        <span>CPU Usage</span>
                      </div>
                      <span className="font-medium">{mockAnalyticsData.realTimeMetrics.cpuUsage}%</span>
                    </div>
                    <Progress value={mockAnalyticsData.realTimeMetrics.cpuUsage} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Battery className="w-4 h-4 text-green-500" />
                        <span>Memory Usage</span>
                      </div>
                      <span className="font-medium">{mockAnalyticsData.realTimeMetrics.memoryUsage}%</span>
                    </div>
                    <Progress value={mockAnalyticsData.realTimeMetrics.memoryUsage} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <HardDrive className="w-4 h-4 text-orange-500" />
                        <span>Disk Usage</span>
                      </div>
                      <span className="font-medium">{mockAnalyticsData.realTimeMetrics.diskUsage}%</span>
                    </div>
                    <Progress value={mockAnalyticsData.realTimeMetrics.diskUsage} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-purple-500" />
                        <span>Network Latency</span>
                      </div>
                      <span className="font-medium">{mockAnalyticsData.realTimeMetrics.networkLatency}ms</span>
                    </div>
                    <Progress value={(mockAnalyticsData.realTimeMetrics.networkLatency / 200) * 100} className="h-3" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Traffic Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-green-500" />
                  Traffic Overview
                </CardTitle>
                <CardDescription>24-hour traffic pattern analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAnalyticsData.performanceData.last24Hours.map((data, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm font-medium w-12">{data.time}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Users: {data.users.toLocaleString()}</span>
                          <span>Requests: {data.requests.toLocaleString()}</span>
                        </div>
                        <Progress value={(data.users / 10000) * 100} className="h-2" />
                      </div>
                      {data.errors > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {data.errors} errors
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  User Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Daily Active Users</p>
                    <p className="text-2xl font-bold">{mockAnalyticsData.userEngagement.dailyActiveUsers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Active Users</p>
                    <p className="text-2xl font-bold">{mockAnalyticsData.userEngagement.monthlyActiveUsers.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Avg Session Duration</p>
                    <p className="text-2xl font-bold">{mockAnalyticsData.userEngagement.sessionDuration}min</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Bounce Rate</span>
                      <span>{mockAnalyticsData.userEngagement.bounceRate}%</span>
                    </div>
                    <Progress value={mockAnalyticsData.userEngagement.bounceRate} className="h-2" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-xl font-bold">{mockAnalyticsData.userEngagement.pageViews.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Unique Visitors</p>
                    <p className="text-xl font-bold">{mockAnalyticsData.userEngagement.uniqueVisitors.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">+12.5%</p>
                    <p className="text-sm text-gray-600">Monthly growth rate</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-green-50 rounded">
                      <p className="text-lg font-bold text-green-700">+2.4K</p>
                      <p className="text-xs text-gray-600">New users today</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded">
                      <p className="text-lg font-bold text-blue-700">94.2%</p>
                      <p className="text-xs text-gray-600">Retention rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-green-500" />
                  System Health Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">System Uptime</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{mockAnalyticsData.systemHealth.uptime}%</span>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  </div>
                  <Progress value={mockAnalyticsData.systemHealth.uptime} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Requests Processed</span>
                    <span className="font-bold">{(mockAnalyticsData.systemHealth.totalRequests / 1000000).toFixed(1)}M</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Peak Concurrent Users</span>
                    <span className="font-bold">{mockAnalyticsData.systemHealth.peakConcurrentUsers.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Data Transfer (GB)</span>
                    <span className="font-bold">{mockAnalyticsData.systemHealth.dataTransfer}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Performance Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">
                      {mockAnalyticsData.realTimeMetrics.throughput}%
                    </p>
                    <p className="text-sm text-gray-600">System Throughput</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded">
                      <p className="text-lg font-bold text-blue-600">
                        {mockAnalyticsData.realTimeMetrics.responseTime}ms
                      </p>
                      <p className="text-xs text-gray-600">Avg Response</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded">
                      <p className="text-lg font-bold text-red-600">
                        {mockAnalyticsData.realTimeMetrics.errorRate}%
                      </p>
                      <p className="text-xs text-gray-600">Error Rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-500" />
                Geographic Distribution
              </CardTitle>
              <CardDescription>User distribution across different regions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.geographicData.map((region, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-20 text-sm font-medium">{region.region}</div>
                    <div className="flex-1">
                      <div className="flex justify-between text-sm mb-1">
                        <span>{region.users.toLocaleString()} users</span>
                        <span>{region.percentage}%</span>
                      </div>
                      <Progress value={region.percentage} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                System Alerts
              </CardTitle>
              <CardDescription>Recent system alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockAnalyticsData.alerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-4 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      alert.severity === 'warning' ? 'bg-yellow-500' :
                      alert.severity === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium">{alert.message}</p>
                      <p className="text-sm text-gray-500">{alert.time}</p>
                    </div>
                    <Badge variant={
                      alert.severity === 'warning' ? 'destructive' :
                      alert.severity === 'success' ? 'default' : 'secondary'
                    }>
                      {alert.severity}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}