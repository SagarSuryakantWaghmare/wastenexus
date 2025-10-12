'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Target,
  Fuel,
  Route,
  Package,
  Shield,
  TrendingUp,
  Calendar,
  Navigation,
  Camera,
  Users,
  Star,
  Timer,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { 
  mockWorker, 
  mockRoutes, 
  mockCollectionTasks, 
  mockPerformanceRecords, 
  mockVehicles,
  type CollectionTask
} from "@/data/mockData";

export default function WorkerDashboard() {
  const [activeTab, setActiveTab] = useState('today');
  
  // Get today's data
  const today = new Date().toISOString().split('T')[0];
  const todayRoute = mockRoutes.find(route => route.date === today);
  const todayTasks = mockCollectionTasks.filter(task => 
    todayRoute ? task.route_id === todayRoute.id : false
  );
  const assignedVehicle = mockVehicles.find(v => v.id === mockWorker.vehicle_id);
  const latestPerformance = mockPerformanceRecords[0];

  // Calculate stats
  const completedTasks = todayTasks.filter(task => task.status === 'collected').length;
  const pendingTasks = todayTasks.filter(task => task.status === 'pending' || task.status === 'in_progress').length;
  const missedTasks = todayTasks.filter(task => task.status === 'missed').length;
  const completionRate = todayTasks.length > 0 ? Math.round((completedTasks / todayTasks.length) * 100) : 0;

  const quickStats = [
    {
      title: "Today's Tasks",
      value: `${completedTasks}/${todayTasks.length}`,
      icon: Target,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Completed collections"
    },
    {
      title: "Route Progress",
      value: `${completionRate}%`,
      icon: Route,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Tasks completed"
    },
    {
      title: "Safety Score",
      value: `${mockWorker.safety_score}%`,
      icon: Shield,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "Safety compliance"
    },
    {
      title: "Performance",
      value: `${mockWorker.rating}/5.0`,
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Current rating"
    }
  ];

  const getTaskStatusBadge = (status: CollectionTask['status']) => {
    const statusConfig = {
      pending: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Timer },
      collected: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      missed: { color: 'bg-red-100 text-red-800', icon: AlertCircle },
      issue_reported: { color: 'bg-orange-100 text-orange-800', icon: AlertTriangle }
    };
    
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500';
      case 'medium': return 'border-l-yellow-500';
      case 'low': return 'border-l-green-500';
      default: return 'border-l-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={mockWorker.avatar_url} alt={mockWorker.name} />
              <AvatarFallback className="text-lg font-semibold bg-blue-100 text-blue-700">
                {mockWorker.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome, {mockWorker.name.split(' ')[0]}!</h1>
              <p className="text-gray-600">Let&apos;s make our city cleaner today</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {mockWorker.employee_id}
                </Badge>
                <Badge variant="outline">
                  <MapPin className="w-3 h-3 mr-1" />
                  {mockWorker.assigned_area}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/worker/routes">
                <Navigation className="w-4 h-4 mr-2" />
                View Routes
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/worker/safety">
                <Shield className="w-4 h-4 mr-2" />
                Safety Check
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Vehicle Info Card */}
        {assignedVehicle && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-blue-500" />
                Your Vehicle Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Registration</p>
                  <p className="font-semibold text-lg">{assignedVehicle.registration_number}</p>
                  <Badge variant="outline" className="capitalize">
                    {assignedVehicle.type}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Capacity</p>
                  <p className="font-semibold">{assignedVehicle.capacity_kg} kg</p>
                  <div className="flex items-center gap-1">
                    <Fuel className="w-3 h-3 text-gray-500" />
                    <span className="text-sm text-gray-600 capitalize">{assignedVehicle.fuel_type}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge className={assignedVehicle.status === 'in_use' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {assignedVehicle.status.replace('_', ' ')}
                  </Badge>
                  <p className="text-xs text-gray-500">Mileage: {assignedVehicle.mileage.toLocaleString()} km</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="today">Today&apos;s Route</TabsTrigger>
            <TabsTrigger value="tasks">Collection Tasks</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="overview">Overview</TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-6">
            {todayRoute ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Route Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Route className="h-5 w-5 text-green-500" />
                      Today&apos;s Route
                    </CardTitle>
                    <CardDescription>
                      {todayRoute.area} • {todayRoute.distance_km} km • Est. {Math.round(todayRoute.estimated_duration / 60)}h {todayRoute.estimated_duration % 60}m
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={
                        todayRoute.status === 'completed' ? 'bg-green-100 text-green-800' :
                        todayRoute.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }>
                        {todayRoute.status.replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-medium">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Start Time</p>
                        <p className="font-medium">
                          {todayRoute.start_time ? new Date(todayRoute.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Not started'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Fuel Estimate</p>
                        <p className="font-medium">{todayRoute.fuel_estimate}L</p>
                      </div>
                    </div>

                    <Button asChild className="w-full">
                      <Link href="/worker/routes">
                        <Navigation className="w-4 h-4 mr-2" />
                        View Full Route
                      </Link>
                    </Button>
                  </CardContent>
                </Card>

                {/* Quick Tasks Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-orange-500" />
                      Task Summary
                    </CardTitle>
                    <CardDescription>Today&apos;s collection progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        <div className="text-xs text-gray-500">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
                        <div className="text-xs text-gray-500">Pending</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{missedTasks}</div>
                        <div className="text-xs text-gray-500">Missed</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium">Next Tasks</h4>
                      {todayTasks
                        .filter(task => task.status === 'pending' || task.status === 'in_progress')
                        .slice(0, 3)
                        .map((task) => (
                        <div key={task.id} className={`p-3 border-l-4 ${getPriorityColor(task.priority)} bg-gray-50 rounded-r-lg`}>
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{task.location.address}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <Clock className="w-3 h-3 text-gray-400" />
                                <span className="text-xs text-gray-500">
                                  {new Date(task.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                            {getTaskStatusBadge(task.status)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/worker/collections">
                        View All Tasks
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No route assigned for today</h3>
                  <p className="text-gray-600">Check with your supervisor or view upcoming routes</p>
                  <Button asChild className="mt-4">
                    <Link href="/worker/routes">View All Routes</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayTasks.map((task) => (
                <Card key={task.id} className={`hover:shadow-lg transition-shadow duration-300 border-l-4 ${getPriorityColor(task.priority)}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{task.location.address}</CardTitle>
                        <CardDescription className="mt-1">
                          Bin ID: {task.bin_id || 'N/A'}
                        </CardDescription>
                      </div>
                      {getTaskStatusBadge(task.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {task.waste_type.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Scheduled</span>
                      <span className="font-medium">
                        {new Date(task.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    
                    {task.collected_at && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Collected</span>
                        <span className="font-medium text-green-600">
                          {new Date(task.collected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    )}
                    
                    {task.weight_kg && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Weight</span>
                        <span className="font-medium">{task.weight_kg} kg</span>
                      </div>
                    )}
                    
                    {task.issue_description && (
                      <div className="p-2 bg-red-50 rounded text-sm">
                        <p className="text-red-700">{task.issue_description}</p>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      {task.status === 'pending' || task.status === 'in_progress' ? (
                        <>
                          <Button size="sm" className="flex-1">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                          <Button size="sm" variant="outline">
                            <Camera className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <Button size="sm" variant="outline" className="w-full">
                          <Camera className="w-3 h-3 mr-1" />
                          View Photo
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-500" />
                    Recent Performance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Completion Rate</p>
                        <p className="text-xl font-bold text-green-600">
                          {Math.round((latestPerformance.tasks_completed / latestPerformance.tasks_assigned) * 100)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Safety Score</p>
                        <p className="text-xl font-bold text-yellow-600">{latestPerformance.safety_score}%</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Avg Time</p>
                        <p className="text-lg font-semibold">{latestPerformance.average_collection_time}m</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Rating</p>
                        <p className="text-lg font-semibold">{latestPerformance.supervisor_rating}/5.0</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Weekly Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockPerformanceRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{new Date(record.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {record.tasks_completed}/{record.tasks_assigned}
                          </Badge>
                          <span className="text-sm font-medium">{record.supervisor_rating}/5</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button asChild variant="outline" className="w-full mt-4">
                    <Link href="/worker/performance">View Detailed Performance</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                      <Star className="h-6 w-6 text-yellow-500" />
                      <div>
                        <p className="font-medium text-sm">Perfect Week</p>
                        <p className="text-xs text-gray-600">100% completion rate</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                      <Shield className="h-6 w-6 text-blue-500" />
                      <div>
                        <p className="font-medium text-sm">Safety Champion</p>
                        <p className="text-xs text-gray-600">30 days no incidents</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                      <Target className="h-6 w-6 text-purple-500" />
                      <div>
                        <p className="font-medium text-sm">Efficiency Expert</p>
                        <p className="text-xs text-gray-600">Avg. 14min per task</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Worker Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-semibold">{mockWorker.experience_years} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Collections</p>
                        <p className="font-semibold">{mockWorker.completed_collections.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Shift</p>
                        <p className="font-semibold capitalize">{mockWorker.shift}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Area</p>
                        <p className="font-semibold">{mockWorker.assigned_area}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button asChild variant="outline" className="h-auto p-4 flex-col">
                      <Link href="/worker/routes">
                        <Navigation className="h-6 w-6 mb-2" />
                        <span className="text-sm">Routes</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col">
                      <Link href="/worker/collections">
                        <Package className="h-6 w-6 mb-2" />
                        <span className="text-sm">Collections</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col">
                      <Link href="/worker/safety">
                        <Shield className="h-6 w-6 mb-2" />
                        <span className="text-sm">Safety</span>
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="h-auto p-4 flex-col">
                      <Link href="/worker/performance">
                        <TrendingUp className="h-6 w-6 mb-2" />
                        <span className="text-sm">Performance</span>
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}