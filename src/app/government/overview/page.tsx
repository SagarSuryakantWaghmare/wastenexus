'use client';

import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Truck, 
  Users, 
  Recycle, 
  Leaf, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Calendar,
  Download,
  RefreshCw,
  Zap,
  Droplets,
  Wind
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockCityData = {
  overview: {
    totalPopulation: 12500000,
    wasteGeneration: 8500,
    collectionEfficiency: 94.2,
    recyclingRate: 78.5,
    environmentalIndex: 8.7,
    airQuality: 'Good',
    waterQuality: 'Excellent',
    energyConsumption: 2450
  },
  districts: [
    {
      id: 1,
      name: 'Central Business District',
      population: 850000,
      wasteGeneration: 1200,
      collectionRate: 98.5,
      recyclingRate: 82,
      status: 'excellent',
      alerts: 0
    },
    {
      id: 2,
      name: 'Residential Zone A',
      population: 2100000,
      wasteGeneration: 1800,
      collectionRate: 95.2,
      recyclingRate: 76,
      status: 'good',
      alerts: 1
    },
    {
      id: 3,
      name: 'Industrial Area',
      population: 320000,
      wasteGeneration: 2100,
      collectionRate: 89.8,
      recyclingRate: 71,
      status: 'warning',
      alerts: 3
    },
    {
      id: 4,
      name: 'Suburban Zone B',
      population: 1800000,
      wasteGeneration: 1400,
      collectionRate: 92.1,
      recyclingRate: 79,
      status: 'good',
      alerts: 1
    },
    {
      id: 5,
      name: 'Commercial District',
      population: 670000,
      wasteGeneration: 980,
      collectionRate: 96.8,
      recyclingRate: 83,
      status: 'excellent',
      alerts: 0
    },
    {
      id: 6,
      name: 'Outskirts',
      population: 890000,
      wasteGeneration: 920,
      collectionRate: 87.5,
      recyclingRate: 68,
      status: 'needs-attention',
      alerts: 4
    }
  ],
  realTimeData: {
    vehiclesActive: 156,
    vehiclesInMaintenance: 8,
    collectionPointsActive: 892,
    collectionPointsFull: 23,
    workersOnDuty: 1247,
    citizenReports: 45,
    emergencyAlerts: 2
  },
  monthlyTrends: {
    wasteCollection: [
      { month: 'Jan', collected: 245000, recycled: 185000 },
      { month: 'Feb', collected: 252000, recycled: 192000 },
      { month: 'Mar', collected: 248000, recycled: 188000 },
      { month: 'Apr', collected: 255000, recycled: 198000 },
      { month: 'May', collected: 261000, recycled: 205000 },
      { month: 'Jun', collected: 258000, recycled: 202000 }
    ]
  }
};

export default function CityOverview() {
  const [selectedView, setSelectedView] = useState('overview');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'bg-green-100 text-green-800 border-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'needs-attention': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">City Overview</h1>
          <p className="text-lg text-gray-600">
            Real-time monitoring and analytics for city-wide waste management
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Time Range
          </Button>
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

      {/* Key City Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg">Population</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockCityData.overview.totalPopulation.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total city population</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+2.3% from last year</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-orange-600" />
              <CardTitle className="text-lg">Waste Generation</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockCityData.overview.wasteGeneration.toLocaleString()}</p>
              <p className="text-sm text-gray-600">tonnes/day</p>
              <div className="flex items-center gap-1 text-red-500 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>+1.2% this month</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Recycle className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Collection Rate</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockCityData.overview.collectionEfficiency}%</p>
              <p className="text-sm text-gray-600">of generated waste</p>
              <Progress value={mockCityData.overview.collectionEfficiency} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-5 h-5 text-green-600" />
              <CardTitle className="text-lg">Environmental Score</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{mockCityData.overview.environmentalIndex}/10</p>
              <p className="text-sm text-gray-600">sustainability index</p>
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <TrendingUp className="w-4 h-4" />
                <span>Excellent performance</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Different Views */}
      <Tabs value={selectedView} onValueChange={setSelectedView} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="districts">Districts</TabsTrigger>
          <TabsTrigger value="realtime">Real-time</TabsTrigger>
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-blue-500" />
                  Collection Efficiency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span>Today&apos;s Collection</span>
                    <span className="font-medium">94.2%</span>
                  </div>
                  <Progress value={94.2} className="h-3" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Weekly Average</span>
                    <span className="font-medium">92.8%</span>
                  </div>
                  <Progress value={92.8} className="h-3" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Monthly Target</span>
                    <span className="font-medium">95.0%</span>
                  </div>
                  <Progress value={95.0} className="h-3" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-green-500" />
                  Recycling Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-green-600">{mockCityData.overview.recyclingRate}%</p>
                    <p className="text-sm text-gray-600">Current recycling rate</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="font-medium text-green-700">Organic</p>
                      <p className="text-lg font-bold">82%</p>
                    </div>
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="font-medium text-blue-700">Plastic</p>
                      <p className="text-lg font-bold">75%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-500" />
                  Citizen Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Training Completion</span>
                    <span className="font-medium">92.3%</span>
                  </div>
                  <Progress value={92.3} className="h-2" />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">App Downloads</span>
                    <span className="font-medium">1.2M</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Reports Today</span>
                    <span className="font-medium">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="districts" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {mockCityData.districts.map((district) => (
              <Card key={district.id} className="relative">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{district.name}</CardTitle>
                      <CardDescription>
                        Population: {district.population.toLocaleString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(district.status)}>
                      {district.status.replace('-', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Waste/Day</p>
                        <p className="font-semibold">{district.wasteGeneration} tonnes</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Collection Rate</p>
                        <p className="font-semibold">{district.collectionRate}%</p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Recycling Rate</span>
                        <span>{district.recyclingRate}%</span>
                      </div>
                      <Progress value={district.recyclingRate} className="h-2" />
                    </div>
                    
                    {district.alerts > 0 && (
                      <div className="flex items-center gap-2 text-orange-600 text-sm">
                        <AlertTriangle className="w-4 h-4" />
                        <span>{district.alerts} active alert{district.alerts > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="realtime" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Truck className="w-4 h-4 text-blue-500" />
                  Active Vehicles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{mockCityData.realTimeData.vehiclesActive}</p>
                  <p className="text-xs text-gray-600">
                    {mockCityData.realTimeData.vehiclesInMaintenance} in maintenance
                  </p>
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>95% operational</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-green-500" />
                  Collection Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{mockCityData.realTimeData.collectionPointsActive}</p>
                  <p className="text-xs text-gray-600">
                    {mockCityData.realTimeData.collectionPointsFull} need attention
                  </p>
                  <div className="flex items-center gap-1 text-orange-500 text-xs">
                    <Clock className="w-3 h-3" />
                    <span>2.5% at capacity</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-500" />
                  Workers on Duty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{mockCityData.realTimeData.workersOnDuty}</p>
                  <p className="text-xs text-gray-600">across all districts</p>
                  <div className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle className="w-3 h-3" />
                    <span>Full staffing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                  Citizen Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{mockCityData.realTimeData.citizenReports}</p>
                  <p className="text-xs text-gray-600">pending resolution</p>
                  <div className="flex items-center gap-1 text-red-500 text-xs">
                    <AlertTriangle className="w-3 h-3" />
                    <span>{mockCityData.realTimeData.emergencyAlerts} urgent</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="environmental" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wind className="w-5 h-5 text-blue-500" />
                  Air Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-green-600">{mockCityData.overview.airQuality}</div>
                  <p className="text-sm text-gray-600">AQI: 45 (Good)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Droplets className="w-5 h-5 text-blue-500" />
                  Water Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-blue-600">{mockCityData.overview.waterQuality}</div>
                  <p className="text-sm text-gray-600">pH: 7.2 (Optimal)</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Energy Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="text-3xl font-bold text-yellow-600">{mockCityData.overview.energyConsumption}</div>
                  <p className="text-sm text-gray-600">MWh/day</p>
                  <div className="flex items-center justify-center gap-1 text-green-600 text-sm">
                    <TrendingDown className="w-4 h-4" />
                    <span>-5% from last month</span>
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