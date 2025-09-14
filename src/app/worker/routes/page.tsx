'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  Fuel,
  Route as RouteIcon,
  Target,
  Truck,
  Calendar,
  CheckCircle,
  AlertCircle,
  Timer,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  Map
} from "lucide-react";
import { 
  mockWorker, 
  mockRoutes, 
  mockCollectionTasks, 
  mockVehicles,
  type Route
} from "@/data/mockData";

export default function RouteOptimizationPage() {
  const [selectedRoute, setSelectedRoute] = useState<string>(mockRoutes[0]?.id || '');
  const [activeTab, setActiveTab] = useState('current');

  const currentRoute = mockRoutes.find(route => route.id === selectedRoute);
  const routeTasks = mockCollectionTasks.filter(task => task.route_id === selectedRoute);
  const assignedVehicle = mockVehicles.find(v => v.id === mockWorker.vehicle_id);

  // Calculate route statistics
  const completedTasks = routeTasks.filter(task => task.status === 'collected').length;
  const totalTasks = routeTasks.length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const getStatusIcon = (status: Route['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Timer className="w-4 h-4 text-blue-500" />;
      case 'cancelled': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'missed': return 'bg-red-500';
      case 'issue_reported': return 'bg-orange-500';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Route Optimization</h1>
            <p className="text-gray-600 mt-2">Optimized collection routes for maximum efficiency</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Truck className="w-3 h-3 mr-1" />
              {assignedVehicle?.registration_number}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Area: {mockWorker.assigned_area}
            </Badge>
          </div>
        </div>

        {/* Route Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Select Route
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRoutes.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedRoute === route.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedRoute(route.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{new Date(route.date).toLocaleDateString()}</span>
                    {getStatusIcon(route.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{route.area}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <RouteIcon className="w-3 h-3" />
                      {route.distance_km}km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {Math.round(route.estimated_duration / 60)}h {route.estimated_duration % 60}m
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentRoute && (
          <div className="space-y-6">
            {/* Route Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Route Progress</CardTitle>
                  <Target className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{progressPercentage}%</div>
                  <p className="text-xs text-gray-500">{completedTasks}/{totalTasks} stops completed</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Distance</CardTitle>
                  <RouteIcon className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentRoute.distance_km} km</div>
                  <p className="text-xs text-gray-500">Optimized route</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Estimated Time</CardTitle>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Math.round(currentRoute.estimated_duration / 60)}h {currentRoute.estimated_duration % 60}m
                  </div>
                  <p className="text-xs text-gray-500">Total duration</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Estimate</CardTitle>
                  <Fuel className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentRoute.fuel_estimate}L</div>
                  <p className="text-xs text-gray-500">Estimated consumption</p>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="current">Current Route</TabsTrigger>
                <TabsTrigger value="map">Route Map</TabsTrigger>
                <TabsTrigger value="optimization">Optimization</TabsTrigger>
              </TabsList>

              <TabsContent value="current" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Route Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <RouteIcon className="h-5 w-5 text-green-500" />
                        Route Details
                      </CardTitle>
                      <CardDescription>
                        {currentRoute.area} • {new Date(currentRoute.date).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(currentRoute.status)}
                            <span className="font-medium capitalize">
                              {currentRoute.status.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Vehicle</p>
                          <p className="font-medium">{assignedVehicle?.registration_number}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Start Time</p>
                          <p className="font-medium">
                            {currentRoute.start_time 
                              ? new Date(currentRoute.start_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : 'Not started'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">End Time</p>
                          <p className="font-medium">
                            {currentRoute.end_time 
                              ? new Date(currentRoute.end_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                              : 'In progress'
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        {currentRoute.status === 'pending' && (
                          <Button className="flex-1">
                            <Play className="w-4 h-4 mr-2" />
                            Start Route
                          </Button>
                        )}
                        {currentRoute.status === 'in_progress' && (
                          <>
                            <Button variant="outline" className="flex-1">
                              <Pause className="w-4 h-4 mr-2" />
                              Pause
                            </Button>
                            <Button className="flex-1">
                              Continue
                            </Button>
                          </>
                        )}
                        <Button variant="outline">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Re-optimize
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Route Stops */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-orange-500" />
                        Route Stops ({currentRoute.optimized_path.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {currentRoute.optimized_path.map((stop, index) => {
                          const task = routeTasks.find(t => 
                            Math.abs(t.location.lat - stop.lat) < 0.001 && 
                            Math.abs(t.location.lng - stop.lng) < 0.001
                          );
                          
                          return (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-2">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                                  task ? getTaskStatusColor(task.status) : 'bg-gray-400'
                                }`}>
                                  {index + 1}
                                </div>
                                {index < currentRoute.optimized_path.length - 1 && (
                                  <ArrowRight className="w-3 h-3 text-gray-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{stop.address}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  {task && (
                                    <>
                                      <Badge variant="outline" className="text-xs">
                                        {task.status.replace('_', ' ')}
                                      </Badge>
                                      <span className="text-xs text-gray-500">
                                        Est. {task.estimated_time}min
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5 text-blue-500" />
                      Interactive Route Map
                    </CardTitle>
                    <CardDescription>
                      Visual representation of your optimized route
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
                      <div className="text-center">
                        <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
                        <p className="text-gray-600 mb-4">
                          Map integration will show your optimized route with real-time navigation
                        </p>
                        <div className="space-y-2 text-sm text-gray-500">
                          <p>• Real-time GPS tracking</p>
                          <p>• Turn-by-turn navigation</p>
                          <p>• Traffic-aware routing</p>
                          <p>• Collection point markers</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Route Legend */}
                <Card>
                  <CardHeader>
                    <CardTitle>Map Legend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-green-500"></div>
                        <span className="text-sm">Completed</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-blue-500"></div>
                        <span className="text-sm">In Progress</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-gray-400"></div>
                        <span className="text-sm">Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full bg-red-500"></div>
                        <span className="text-sm">Missed/Issues</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="optimization" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Metrics</CardTitle>
                      <CardDescription>How this route was optimized</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Distance Saved</span>
                          <span className="font-bold text-green-600">-3.2 km</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Time Saved</span>
                          <span className="font-bold text-green-600">-45 min</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Fuel Saved</span>
                          <span className="font-bold text-green-600">-0.8 L</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">CO₂ Reduced</span>
                          <span className="font-bold text-green-600">-2.1 kg</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Factors</CardTitle>
                      <CardDescription>Factors considered in route planning</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Traffic patterns analyzed</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Bin capacity considered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Priority locations first</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Vehicle constraints applied</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span className="text-sm">Time windows respected</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Alternative Routes</CardTitle>
                    <CardDescription>Other possible route configurations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border border-green-200 bg-green-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium text-green-800">Current Route (Recommended)</p>
                            <p className="text-sm text-green-600">Optimized for efficiency and fuel savings</p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Selected</Badge>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Fastest Route</p>
                            <p className="text-sm text-gray-600">Prioritizes completion time (+15min fuel)</p>
                          </div>
                          <Button variant="outline" size="sm">Select</Button>
                        </div>
                      </div>
                      
                      <div className="p-3 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">Eco-Friendly Route</p>
                            <p className="text-sm text-gray-600">Minimizes emissions (+20min time)</p>
                          </div>
                          <Button variant="outline" size="sm">Select</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}