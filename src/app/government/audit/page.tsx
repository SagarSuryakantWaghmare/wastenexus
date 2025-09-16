'use client';

import { useState } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Calendar, 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  CheckCircle,
  Clock,
  Users,
  Truck,
  Recycle,
  Leaf,
  Search,
  Eye,
  Share,
  RefreshCw,
  Plus,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockReports = [
  {
    id: 1,
    title: 'Monthly Environmental Impact Report',
    type: 'environmental',
    period: 'December 2024',
    status: 'completed',
    generatedDate: '2024-01-05',
    size: '2.4 MB',
    downloads: 156,
    summary: {
      wasteReduction: 15.2,
      recyclingIncrease: 8.7,
      emissionReduction: 12.4,
      complianceScore: 94.2
    }
  },
  {
    id: 2,
    title: 'Waste Collection Efficiency Analysis',
    type: 'operational',
    period: 'Q4 2024',
    status: 'completed',
    generatedDate: '2024-01-03',
    size: '1.8 MB',
    downloads: 89,
    summary: {
      collectionRate: 96.8,
      routeOptimization: 23.5,
      fuelSavings: 18.2,
      citizenSatisfaction: 92.1
    }
  },
  {
    id: 3,
    title: 'Policy Compliance Audit',
    type: 'compliance',
    period: 'December 2024',
    status: 'completed',
    generatedDate: '2024-01-02',
    size: '3.1 MB',
    downloads: 234,
    summary: {
      overallCompliance: 89.7,
      violations: 156,
      penalties: 2100000,
      improvements: 67
    }
  },
  {
    id: 4,
    title: 'Citizen Training Progress Report',
    type: 'training',
    period: 'December 2024',
    status: 'generating',
    generatedDate: '2024-01-06',
    size: '0 MB',
    downloads: 0,
    summary: {
      completionRate: 92.3,
      newRegistrations: 1245,
      certificatesIssued: 2890,
      averageScore: 87.5
    }
  },
  {
    id: 5,
    title: 'Green Champions Performance',
    type: 'community',
    period: 'December 2024',
    status: 'completed',
    generatedDate: '2024-01-01',
    size: '1.5 MB',
    downloads: 67,
    summary: {
      activeChampions: 456,
      areasMonitored: 89,
      issuesReported: 234,
      resolutionRate: 94.7
    }
  },
  {
    id: 6,
    title: 'Air Quality Impact Assessment',
    type: 'environmental',
    period: 'Q4 2024',
    status: 'draft',
    generatedDate: '2024-01-07',
    size: '0 MB',
    downloads: 0,
    summary: {
      aqiImprovement: 8.5,
      emissionReduction: 15.2,
      healthBenefits: 2.1,
      economicImpact: 450000
    }
  }
];

const mockMetrics = {
  totalReports: 156,
  reportsThisMonth: 23,
  avgComplianceScore: 89.7,
  totalDownloads: 12450,
  wasteReductionYTD: 125000,
  recyclingRateImprovement: 12.5,
  emissionReduction: 18.7,
  costSavings: 2500000
};

export default function AuditReports() {
  const [selectedTab, setSelectedTab] = useState('reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'generating': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'environmental': return <Leaf className="w-4 h-4" />;
      case 'operational': return <Truck className="w-4 h-4" />;
      case 'compliance': return <CheckCircle className="w-4 h-4" />;
      case 'training': return <Users className="w-4 h-4" />;
      case 'community': return <Users className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesPeriod = selectedPeriod === 'all' || report.period.includes(selectedPeriod);
    return matchesSearch && matchesType && matchesPeriod;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Audit Reports</h1>
          <p className="text-lg text-gray-600">
            Comprehensive analytics and compliance reporting for environmental management
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Report
          </Button>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Export All
          </Button>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Total Reports</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockMetrics.totalReports}</p>
              <p className="text-sm text-gray-600">{mockMetrics.reportsThisMonth} this month</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+8.2% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Compliance Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockMetrics.avgComplianceScore}%</p>
              <Progress value={mockMetrics.avgComplianceScore} className="h-2" />
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+2.1% improvement</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Waste Reduced</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{(mockMetrics.wasteReductionYTD / 1000).toFixed(0)}K</p>
              <p className="text-sm text-gray-600">tonnes this year</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+{mockMetrics.recyclingRateImprovement}% recycling</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Cost Savings</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">₹{(mockMetrics.costSavings / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">through optimizations</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>{mockMetrics.emissionReduction}% emissions</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reports">All Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-3">
            <select 
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Types</option>
              <option value="environmental">Environmental</option>
              <option value="operational">Operational</option>
              <option value="compliance">Compliance</option>
              <option value="training">Training</option>
              <option value="community">Community</option>
            </select>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 border rounded"
            >
              <option value="all">All Periods</option>
              <option value="2024">2024</option>
              <option value="Q4">Q4</option>
              <option value="December">December</option>
            </select>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid gap-6">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-gray-100 rounded">
                          {getTypeIcon(report.type)}
                        </div>
                        <div>
                          <CardTitle className="text-xl">{report.title}</CardTitle>
                          <CardDescription>
                            {report.period} • Generated {report.generatedDate}
                          </CardDescription>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(report.status)}>
                        {report.status}
                      </Badge>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share className="w-4 h-4" />
                        </Button>
                        {report.status === 'completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Report Summary Metrics */}
                    {report.type === 'environmental' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Waste Reduction</p>
                          <p className="font-semibold text-green-600">{report.summary.wasteReduction}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Recycling Increase</p>
                          <p className="font-semibold text-blue-600">{report.summary.recyclingIncrease}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Emission Reduction</p>
                          <p className="font-semibold text-green-600">{report.summary.emissionReduction}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Compliance Score</p>
                          <p className="font-semibold">{report.summary.complianceScore}%</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === 'operational' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Collection Rate</p>
                          <p className="font-semibold text-green-600">{report.summary.collectionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Route Optimization</p>
                          <p className="font-semibold text-blue-600">{report.summary.routeOptimization}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Fuel Savings</p>
                          <p className="font-semibold text-green-600">{report.summary.fuelSavings}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Satisfaction</p>
                          <p className="font-semibold">{report.summary.citizenSatisfaction}%</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === 'compliance' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Overall Compliance</p>
                          <p className="font-semibold text-green-600">{report.summary.overallCompliance}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Violations</p>
                          <p className="font-semibold text-orange-600">{report.summary.violations}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Penalties</p>
                          <p className="font-semibold">₹{((report.summary.penalties || 0) / 1000000).toFixed(1)}M</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Improvements</p>
                          <p className="font-semibold text-green-600">{report.summary.improvements}</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === 'training' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Completion Rate</p>
                          <p className="font-semibold text-green-600">{report.summary.completionRate}%</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">New Registrations</p>
                          <p className="font-semibold text-blue-600">{report.summary.newRegistrations}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Certificates</p>
                          <p className="font-semibold">{report.summary.certificatesIssued}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Average Score</p>
                          <p className="font-semibold text-green-600">{report.summary.averageScore}%</p>
                        </div>
                      </>
                    )}
                    
                    {report.type === 'community' && (
                      <>
                        <div>
                          <p className="text-sm text-gray-500">Active Champions</p>
                          <p className="font-semibold text-blue-600">{report.summary.activeChampions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Areas Monitored</p>
                          <p className="font-semibold">{report.summary.areasMonitored}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Issues Reported</p>
                          <p className="font-semibold text-orange-600">{report.summary.issuesReported}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Resolution Rate</p>
                          <p className="font-semibold text-green-600">{report.summary.resolutionRate}%</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span>Size: {report.size}</span>
                      <span>Downloads: {report.downloads}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {report.status === 'generating' && (
                        <>
                          <Clock className="w-4 h-4" />
                          <span>Generating...</span>
                        </>
                      )}
                      {report.status === 'completed' && (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Ready for download</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Monthly Environmental Impact</h4>
                    <p className="text-sm text-gray-600">Every 1st of the month at 9:00 AM</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Weekly Operational Report</h4>
                    <p className="text-sm text-gray-600">Every Monday at 8:00 AM</p>
                  </div>
                  <Badge>Active</Badge>
                </div>
                <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Quarterly Compliance Audit</h4>
                    <p className="text-sm text-gray-600">Every quarter end at 6:00 PM</p>
                  </div>
                  <Badge variant="secondary">Paused</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Report Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Environmental Reports</span>
                    <span className="font-medium">45</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Compliance Reports</span>
                    <span className="font-medium">38</span>
                  </div>
                  <Progress value={63} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Operational Reports</span>
                    <span className="font-medium">42</span>
                  </div>
                  <Progress value={70} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span>Training Reports</span>
                    <span className="font-medium">31</span>
                  </div>
                  <Progress value={52} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Download Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <p className="text-3xl font-bold">{mockMetrics.totalDownloads.toLocaleString()}</p>
                  <p className="text-gray-600">Total downloads</p>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">This Month</span>
                    <span className="font-medium">1,245</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Last Month</span>
                    <span className="font-medium">1,156</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Growth Rate</span>
                    <span className="font-medium text-green-600">+7.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {['Environmental Impact', 'Operational Efficiency', 'Compliance Audit', 'Training Progress', 'Community Engagement', 'Financial Analysis'].map((template, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{template} Template</CardTitle>
                  <CardDescription>
                    Standard template for {template.toLowerCase()} reporting
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Last used: 2 days ago</span>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}