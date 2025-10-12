'use client';

import { useState } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Users,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Download,
  Upload,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const mockPolicies = [
  {
    id: 1,
    title: 'Single-Use Plastic Ban',
    description: 'Complete prohibition of single-use plastic items including bags, straws, and cutlery',
    status: 'active',
    category: 'environmental',
    priority: 'high',
    compliance: 87.3,
    affectedCitizens: 2500000,
    implementationDate: '2024-01-01',
    lastUpdated: '2024-01-15',
    penalties: 'Fine ₹500-5000',
    target: 'Eliminate 90% of single-use plastic by 2024',
    progress: 87.3,
    violations: 156,
    inspections: 892
  },
  {
    id: 2,
    title: 'E-Waste Collection Mandate',
    description: 'Mandatory e-waste segregation and collection from households and businesses',
    status: 'active',
    category: 'waste-management',
    priority: 'medium',
    compliance: 94.1,
    affectedCitizens: 1800000,
    implementationDate: '2023-11-01',
    lastUpdated: '2024-01-12',
    penalties: 'Fine ₹1000-10000',
    target: 'Collect 95% of e-waste safely',
    progress: 94.1,
    violations: 43,
    inspections: 567
  },
  {
    id: 3,
    title: 'Organic Waste Composting Initiative',
    description: 'Mandatory composting of organic waste in residential and commercial areas',
    status: 'draft',
    category: 'waste-management',
    priority: 'high',
    compliance: null,
    affectedCitizens: 3200000,
    implementationDate: '2024-03-01',
    lastUpdated: '2024-01-18',
    penalties: 'Warning then fine ₹200-2000',
    target: 'Compost 85% of organic waste',
    progress: 0,
    violations: 0,
    inspections: 0
  },
  {
    id: 4,
    title: 'Green Building Standards',
    description: 'Environmental standards for new construction and renovation projects',
    status: 'active',
    category: 'construction',
    priority: 'medium',
    compliance: 76.8,
    affectedCitizens: 500000,
    implementationDate: '2023-06-01',
    lastUpdated: '2024-01-10',
    penalties: 'Project halt + fine ₹50000-500000',
    target: 'All new buildings green certified',
    progress: 76.8,
    violations: 23,
    inspections: 234
  },
  {
    id: 5,
    title: 'Air Quality Monitoring',
    description: 'Mandatory air quality monitoring and reporting for industrial facilities',
    status: 'review',
    category: 'environmental',
    priority: 'high',
    compliance: 91.2,
    affectedCitizens: 800000,
    implementationDate: '2023-01-01',
    lastUpdated: '2024-01-16',
    penalties: 'Operations suspension + fine',
    target: 'Maintain AQI below 100',
    progress: 91.2,
    violations: 12,
    inspections: 345
  }
];

const mockStats = {
  totalPolicies: 23,
  activePolicies: 18,
  draftPolicies: 3,
  reviewPolicies: 2,
  averageCompliance: 89.7,
  totalViolations: 234,
  totalInspections: 2038,
  affectedCitizens: 12500000
};

export default function PolicyTools() {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'draft': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'review': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Policy Management</h1>
          <p className="text-lg text-gray-600">
            Create, manage, and monitor environmental policies and regulations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Create Policy
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Policy</DialogTitle>
                <DialogDescription>
                  Add a new environmental policy or regulation for the city
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Policy Title</label>
                  <Input placeholder="Enter policy title" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea placeholder="Enter detailed policy description" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <select className="w-full p-2 border rounded">
                      <option>Environmental</option>
                      <option>Waste Management</option>
                      <option>Construction</option>
                      <option>Transportation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Priority</label>
                    <select className="w-full p-2 border rounded">
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Implementation Date</label>
                  <Input type="date" />
                </div>
                <div className="flex gap-3 pt-4">
                  <Button className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Policy Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Total Policies</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockStats.totalPolicies}</p>
              <div className="text-sm text-gray-600">
                <span className="text-green-600 font-medium">{mockStats.activePolicies} active</span>
                {' • '}
                <span className="text-gray-500">{mockStats.draftPolicies} draft</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Compliance Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockStats.averageCompliance}%</p>
              <Progress value={mockStats.averageCompliance} className="h-2" />
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+2.1% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Violations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockStats.totalViolations}</p>
              <p className="text-sm text-gray-600">this month</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingDown className="w-4 h-4" />
                <span>-8.3% from last month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              <CardTitle className="text-lg">Affected Citizens</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{(mockStats.affectedCitizens / 1000000).toFixed(1)}M</p>
              <p className="text-sm text-gray-600">across all policies</p>
              <p className="text-sm text-blue-600">{mockStats.totalInspections} inspections</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Policy Management Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">All Policies</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search policies..."
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
              <option value="environmental">Environmental</option>
              <option value="waste-management">Waste Management</option>
              <option value="construction">Construction</option>
              <option value="transportation">Transportation</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6">
            {filteredPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-2">
                        <CardTitle className="text-xl">{policy.title}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={getStatusColor(policy.status)}>
                            {policy.status}
                          </Badge>
                          <Badge className={getPriorityColor(policy.priority)}>
                            {policy.priority} priority
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-base">
                        {policy.description}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Affected Citizens</p>
                      <p className="font-semibold">{(policy.affectedCitizens / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Implementation</p>
                      <p className="font-semibold">{policy.implementationDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Violations</p>
                      <p className="font-semibold text-orange-600">{policy.violations}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Compliance Rate</p>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{policy.compliance ? `${policy.compliance}%` : 'N/A'}</p>
                        {policy.compliance && (
                          <div className="flex-1">
                            <Progress value={policy.compliance} className="h-2" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        Last updated: {policy.lastUpdated}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        Target: {policy.target}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="active" className="space-y-6">
          <div className="grid gap-6">
            {filteredPolicies.filter(p => p.status === 'active').map((policy) => (
              <Card key={policy.id} className="border-green-200">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-green-800">{policy.title}</CardTitle>
                      <CardDescription>{policy.description}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Active since {policy.implementationDate}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-6">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Compliance Rate</p>
                      <p className="text-2xl font-bold text-green-600">{policy.compliance}%</p>
                      <Progress value={policy.compliance} className="h-2 mt-2" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Inspections</p>
                      <p className="text-2xl font-bold">{policy.inspections}</p>
                      <p className="text-sm text-green-600">+12% this month</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Violations</p>
                      <p className="text-2xl font-bold text-orange-600">{policy.violations}</p>
                      <p className="text-sm text-green-600">-15% this month</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Compliance Overview</CardTitle>
                <CardDescription>Overall policy compliance trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPolicies.filter(p => p.compliance).map((policy) => (
                    <div key={policy.id} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{policy.title}</span>
                        <span className="font-medium">{policy.compliance}%</span>
                      </div>
                      <Progress value={policy.compliance} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Violation Tracking</CardTitle>
                <CardDescription>Recent violations and enforcement actions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPolicies.filter(p => p.violations > 0).map((policy) => (
                    <div key={policy.id} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{policy.title}</h4>
                        <Badge variant="destructive">{policy.violations} violations</Badge>
                      </div>
                      <p className="text-sm text-gray-600">{policy.penalties}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Policy Effectiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">89.7%</p>
                  <p className="text-sm text-gray-600">Average compliance</p>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Environmental</span>
                      <span>91.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Waste Management</span>
                      <span>88.3%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Construction</span>
                      <span>86.1%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Monthly Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Compliance Up</p>
                      <p className="text-sm text-gray-600">+2.1% this month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-green-500" />
                    <div>
                      <p className="font-medium">Violations Down</p>
                      <p className="text-sm text-gray-600">-8.3% this month</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Inspections Up</p>
                      <p className="text-sm text-gray-600">+15.2% this month</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Impact Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Citizens Affected</p>
                    <p className="text-xl font-bold">12.5M</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Inspections</p>
                    <p className="text-xl font-bold">2,038</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Revenue Generated</p>
                    <p className="text-xl font-bold">₹2.1M</p>
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