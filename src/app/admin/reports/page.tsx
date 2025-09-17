'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Filter, 
  Search, 
  TrendingUp, 
  PieChart, 
  BarChart3, 
  Globe, 
  Users, 
  Trash2, 
  Recycle, 
  Target, 
  AlertTriangle,
  CheckCircle,
  Clock,
  FileSpreadsheet,
  FilePdf,
  FileImage,
  RefreshCw,
  Eye,
  Share2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';

const mockReportsData = {
  reportStats: {
    totalReports: 15789,
    activeReports: 2340,
    resolvedReports: 13449,
    pendingReports: 567,
    criticalReports: 23,
    weeklyGrowth: 12.5
  },
  systemReports: [
    {
      id: 1,
      title: 'Monthly Waste Collection Summary',
      type: 'collection',
      generatedDate: '2024-01-20',
      period: 'January 2024',
      status: 'ready',
      format: 'PDF',
      size: '2.4 MB',
      description: 'Comprehensive waste collection data for all regions',
      category: 'Operations'
    },
    {
      id: 2,
      title: 'User Engagement Analytics',
      type: 'analytics',
      generatedDate: '2024-01-19',
      period: 'Q1 2024',
      status: 'ready',
      format: 'Excel',
      size: '1.8 MB',
      description: 'User activity, training completion, and app usage metrics',
      category: 'User Management'
    },
    {
      id: 3,
      title: 'Environmental Impact Assessment',
      type: 'environmental',
      generatedDate: '2024-01-18',
      period: 'Annual 2023',
      status: 'ready',
      format: 'PDF',
      size: '5.2 MB',
      description: 'Carbon footprint reduction and waste diversion metrics',
      category: 'Sustainability'
    },
    {
      id: 4,
      title: 'Champion Performance Report',
      type: 'performance',
      generatedDate: '2024-01-17',
      period: 'December 2023',
      status: 'generating',
      format: 'PDF',
      size: 'Pending',
      description: 'Green Champions effectiveness and community impact',
      category: 'Performance'
    },
    {
      id: 5,
      title: 'Compliance Audit Report',
      type: 'compliance',
      generatedDate: '2024-01-16',
      period: 'Q4 2023',
      status: 'ready',
      format: 'PDF',
      size: '3.1 MB',
      description: 'Regulatory compliance and policy adherence assessment',
      category: 'Compliance'
    },
    {
      id: 6,
      title: 'Training Effectiveness Analysis',
      type: 'training',
      generatedDate: '2024-01-15',
      period: 'December 2023',
      status: 'scheduled',
      format: 'Excel',
      size: 'Pending',
      description: 'Training program completion rates and knowledge retention',
      category: 'Education'
    }
  ],
  quickStats: {
    wasteCollected: 25680,
    carbonReduced: 1240,
    usersActive: 8950,
    trainingsCompleted: 2340,
    reportsGenerated: 156,
    citiesActive: 25
  },
  recentActivities: [
    {
      id: 1,
      action: 'Generated monthly collection report',
      user: 'System Auto-Report',
      time: '2 hours ago',
      type: 'generation'
    },
    {
      id: 2,
      action: 'Downloaded user analytics report',
      user: 'Admin User',
      time: '4 hours ago',
      type: 'download'
    },
    {
      id: 3,
      action: 'Scheduled compliance audit report',
      user: 'Compliance Officer',
      time: '6 hours ago',
      type: 'schedule'
    },
    {
      id: 4,
      action: 'Shared environmental impact report',
      user: 'Policy Manager',
      time: '1 day ago',
      type: 'share'
    }
  ]
};

export default function Reports() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generating': return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'scheduled': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'PDF': return <FilePdf className="w-4 h-4 text-red-500" />;
      case 'Excel': return <FileSpreadsheet className="w-4 h-4 text-green-500" />;
      case 'Image': return <FileImage className="w-4 h-4 text-blue-500" />;
      default: return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800';
      case 'generating': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReports = mockReportsData.systemReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Reports & Analytics</h1>
          <p className="text-lg text-gray-600">
            Generate, manage, and analyze system reports and insights
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button size="sm">
            <FileText className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Reports</p>
                <p className="text-xl font-bold">{(mockReportsData.reportStats.totalReports / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-xl font-bold">{(mockReportsData.reportStats.activeReports / 1000).toFixed(1)}K</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-xl font-bold">{(mockReportsData.reportStats.resolvedReports / 1000).toFixed(1)}K</p>
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
                <p className="text-xl font-bold">{mockReportsData.reportStats.pendingReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-xl font-bold">{mockReportsData.reportStats.criticalReports}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Growth</p>
                <p className="text-xl font-bold">+{mockReportsData.reportStats.weeklyGrowth}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Management Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Reports</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="insights">Key Insights</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search reports by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Categories</option>
              <option value="Operations">Operations</option>
              <option value="User Management">User Management</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Performance">Performance</option>
              <option value="Compliance">Compliance</option>
              <option value="Education">Education</option>
            </select>
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Status</option>
              <option value="ready">Ready</option>
              <option value="generating">Generating</option>
              <option value="scheduled">Scheduled</option>
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
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Comprehensive reports generated by the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getFormatIcon(report.format)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{report.title}</h4>
                        <Badge variant="outline">{report.category}</Badge>
                        <Badge className={getStatusColor(report.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(report.status)}
                            {report.status}
                          </div>
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2">{report.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-2 text-xs text-gray-500">
                        <div>
                          <span className="font-medium">Period: </span>
                          {report.period}
                        </div>
                        <div>
                          <span className="font-medium">Generated: </span>
                          {report.generatedDate}
                        </div>
                        <div>
                          <span className="font-medium">Format: </span>
                          {report.format}
                        </div>
                        <div>
                          <span className="font-medium">Size: </span>
                          {report.size}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {report.status === 'ready' && (
                        <>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      {report.status === 'generating' && (
                        <Button variant="ghost" size="sm" disabled>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trash2 className="w-5 h-5 text-green-500" />
                  Waste Collection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-green-600">{mockReportsData.quickStats.wasteCollected.toLocaleString()}</p>
                  <p className="text-gray-600">Tons Collected</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-medium">2,340 tons</span>
                  </div>
                  <Progress value={78} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Target Progress</span>
                    <span className="text-green-600">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-blue-500" />
                  Carbon Reduction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-blue-600">{mockReportsData.quickStats.carbonReduced.toLocaleString()}</p>
                  <p className="text-gray-600">Tons CO₂ Saved</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>This Month</span>
                    <span className="font-medium">156 tons</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Target Progress</span>
                    <span className="text-blue-600">65%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  User Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold text-purple-600">{mockReportsData.quickStats.usersActive.toLocaleString()}</p>
                  <p className="text-gray-600">Active Users</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Trainings Completed</span>
                    <span className="font-medium">{mockReportsData.quickStats.trainingsCompleted}</span>
                  </div>
                  <Progress value={85} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="text-purple-600">85%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated reports scheduled for generation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredReports.filter(report => report.status === 'scheduled').map((report) => (
                  <div key={report.id} className="flex items-center gap-4 p-4 border rounded-lg bg-yellow-50">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    
                    <div className="flex-1">
                      <h4 className="font-medium">{report.title}</h4>
                      <p className="text-sm text-gray-600">{report.description}</p>
                      <p className="text-xs text-gray-500">Scheduled for {report.period}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        Generate Now
                      </Button>
                      <Button size="sm" variant="outline">
                        Edit Schedule
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Waste Diversion Rate</span>
                    <span className="font-bold text-green-600">92.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Collection Efficiency</span>
                    <span className="font-bold text-blue-600">87.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Satisfaction</span>
                    <span className="font-bold text-purple-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Completion</span>
                    <span className="font-bold text-orange-600">78.9%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockReportsData.recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 text-sm">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.type === 'generation' ? 'bg-green-500' :
                        activity.type === 'download' ? 'bg-blue-500' :
                        activity.type === 'schedule' ? 'bg-yellow-500' : 'bg-purple-500'
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-gray-600 text-xs">{activity.user}</p>
                      </div>
                      <p className="text-gray-500 text-xs">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}