'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Clock,
  Fuel,
  Shield,
  MessageSquare,
  Star,
  Users,
  Calendar,
  BarChart3,
  Activity,
  CheckCircle,
  AlertCircle,
  Timer,
  Route,
  Truck,
  ThumbsUp
} from "lucide-react";
import { 
  mockPerformanceRecords,
  mockWorker,
  mockVehicles
} from "@/data/mockData";

export default function PerformancePage() {
  const [activeTab, setActiveTab] = useState('overview');

  const assignedVehicle = mockVehicles.find(v => v.id === mockWorker.vehicle_id);
  
  // Get recent performance data
  const recentRecord = mockPerformanceRecords[0];
  const weeklyRecords = mockPerformanceRecords.slice(0, 7);
  
  // Calculate averages and trends
  const avgCollectionTime = (weeklyRecords.reduce((acc, record) => acc + record.average_collection_time, 0) / weeklyRecords.length).toFixed(1);
  const avgSafetyScore = Math.round(weeklyRecords.reduce((acc, record) => acc + record.safety_score, 0) / weeklyRecords.length);
  const avgCustomerRating = (weeklyRecords.reduce((acc, record) => acc + record.customer_feedback, 0) / weeklyRecords.length).toFixed(1);
  
  // Calculate completion rate
  const totalAssigned = weeklyRecords.reduce((acc, record) => acc + record.tasks_assigned, 0);
  const totalCompleted = weeklyRecords.reduce((acc, record) => acc + record.tasks_completed, 0);
  const completionRate = Math.round((totalCompleted / totalAssigned) * 100);

  const getPerformanceColor = (score: number, threshold: number = 85) => {
    if (score >= threshold) return 'text-green-600';
    if (score >= threshold - 15) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
            <p className="text-gray-600 mt-2">Track your work performance and achievements</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Users className="w-3 h-3 mr-1" />
              {mockWorker.name}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              This Week
            </Badge>
          </div>
        </div>

        {/* Key Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Target className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
              <p className="text-xs text-gray-500">{totalCompleted}/{totalAssigned} tasks this week</p>
              <Progress value={completionRate} className="mt-2" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Collection Time</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCollectionTime} min</div>
              <p className="text-xs text-gray-500">Per collection task</p>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingDown className="h-3 w-3 mr-1" />
                <span className="text-xs">2.3 min faster</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <Shield className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getPerformanceColor(avgSafetyScore, 95)}`}>
                {avgSafetyScore}%
              </div>
              <p className="text-xs text-gray-500">Safety compliance</p>
              <div className="flex items-center mt-2 text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                <span className="text-xs">+2% this week</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Customer Rating</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCustomerRating}/5.0</div>
              <div className="flex items-center mt-1">
                {getRatingStars(parseFloat(avgCustomerRating))}
              </div>
              <p className="text-xs text-gray-500 mt-1">Based on {weeklyRecords.length} days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Metrics</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Performance
                  </CardTitle>
                  <CardDescription>Latest performance summary</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-medium">{new Date(recentRecord.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tasks Completed</p>
                      <p className="font-medium">{recentRecord.tasks_completed}/{recentRecord.tasks_assigned}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Distance Covered</p>
                      <p className="font-medium">{recentRecord.total_distance_km} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Fuel Efficiency</p>
                      <p className="font-medium">{recentRecord.fuel_efficiency} L/100km</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Supervisor Rating</p>
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{recentRecord.supervisor_rating}/5.0</span>
                        {getRatingStars(recentRecord.supervisor_rating).slice(0, 3)}
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Incidents</p>
                      <div className="flex items-center gap-1">
                        {recentRecord.incidents === 0 ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="font-medium">{recentRecord.incidents}</span>
                      </div>
                    </div>
                  </div>

                  {recentRecord.feedback && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-blue-800 font-medium">Supervisor Feedback:</p>
                      <p className="text-sm text-blue-700 mt-1">{recentRecord.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-500" />
                    Performance Trends
                  </CardTitle>
                  <CardDescription>Weekly performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Task Completion</span>
                        <span className="text-sm text-gray-600">{completionRate}%</span>
                      </div>
                      <Progress value={completionRate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Safety Compliance</span>
                        <span className="text-sm text-gray-600">{avgSafetyScore}%</span>
                      </div>
                      <Progress value={avgSafetyScore} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Customer Satisfaction</span>
                        <span className="text-sm text-gray-600">{(parseFloat(avgCustomerRating) * 20).toFixed(0)}%</span>
                      </div>
                      <Progress value={parseFloat(avgCustomerRating) * 20} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Time Efficiency</span>
                        <span className="text-sm text-gray-600">87%</span>
                      </div>
                      <Progress value={87} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Weekly Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
                  {weeklyRecords.map((record) => (
                    <div key={record.id} className="p-3 border rounded-lg text-center">
                      <p className="text-xs text-gray-600 mb-2">
                        {new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {record.tasks_completed}/{record.tasks_assigned}
                        </div>
                        <div className="text-xs text-gray-500">Tasks</div>
                        <div className={`text-xs font-medium ${getPerformanceColor(record.safety_score, 95)}`}>
                          {record.safety_score}%
                        </div>
                        <div className="text-xs text-gray-500">Safety</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Efficiency Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Timer className="h-5 w-5 text-blue-500" />
                    Time Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Collection Time</span>
                    <span className="font-medium">{avgCollectionTime} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fastest Collection</span>
                    <span className="font-medium">9.2 min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Overtime Hours</span>
                    <span className="font-medium">{recentRecord.overtime_hours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">On-Time Rate</span>
                    <span className="font-medium text-green-600">94%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Route Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Route className="h-5 w-5 text-green-500" />
                    Route Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Distance This Week</span>
                    <span className="font-medium">{weeklyRecords.reduce((acc, r) => acc + r.total_distance_km, 0).toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Avg Daily Distance</span>
                    <span className="font-medium">{(weeklyRecords.reduce((acc, r) => acc + r.total_distance_km, 0) / weeklyRecords.length).toFixed(1)} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Route Optimization</span>
                    <span className="font-medium text-green-600">98%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">GPS Accuracy</span>
                    <span className="font-medium">99.2%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5 text-orange-500" />
                    Vehicle Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vehicle</span>
                    <span className="font-medium">{assignedVehicle?.registration_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Fuel Efficiency</span>
                    <span className="font-medium">{recentRecord.fuel_efficiency} L/100km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maintenance Score</span>
                    <span className="font-medium text-green-600">95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Vehicle Utilization</span>
                    <span className="font-medium">89%</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Customer Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-blue-500" />
                    Customer Feedback
                  </CardTitle>
                  <CardDescription>Recent feedback from citizens</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { rating: 5, comment: "Very punctual and professional. Thanks!", date: "2 days ago" },
                    { rating: 4, comment: "Good service, but could be earlier in the morning.", date: "3 days ago" },
                    { rating: 5, comment: "Excellent work! Very clean collection.", date: "5 days ago" },
                    { rating: 4, comment: "Reliable service as always.", date: "1 week ago" }
                  ].map((feedback, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          {getRatingStars(feedback.rating)}
                        </div>
                        <span className="text-xs text-gray-500">{feedback.date}</span>
                      </div>
                      <p className="text-sm text-gray-700">{feedback.comment}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Supervisor Feedback */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5 text-green-500" />
                    Supervisor Feedback
                  </CardTitle>
                  <CardDescription>Performance reviews and recommendations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {weeklyRecords.slice(0, 4).map((record) => (
                    <div key={record.id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="font-medium">{record.supervisor_rating}/5.0</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(record.date).toLocaleDateString()}
                        </span>
                      </div>
                      {record.feedback && (
                        <p className="text-sm text-gray-700">{record.feedback}</p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievements */}
              {[
                {
                  title: "Perfect Week",
                  description: "100% task completion for 7 consecutive days",
                  icon: <Award className="h-8 w-8 text-yellow-500" />,
                  earned: true,
                  date: "This week"
                },
                {
                  title: "Safety Champion",
                  description: "30 days without safety incidents",
                  icon: <Shield className="h-8 w-8 text-blue-500" />,
                  earned: true,
                  date: "Last month"
                },
                {
                  title: "Speed Demon",
                  description: "Average collection time under 15 minutes",
                  icon: <Timer className="h-8 w-8 text-green-500" />,
                  earned: true,
                  date: "2 weeks ago"
                },
                {
                  title: "Customer Favorite",
                  description: "4.5+ average customer rating",
                  icon: <Star className="h-8 w-8 text-purple-500" />,
                  earned: true,
                  date: "This month"
                },
                {
                  title: "Eco Warrior",
                  description: "Best fuel efficiency in the team",
                  icon: <Fuel className="h-8 w-8 text-green-600" />,
                  earned: false,
                  date: "In progress"
                },
                {
                  title: "Route Master",
                  description: "Optimize 50 collection routes",
                  icon: <Route className="h-8 w-8 text-orange-500" />,
                  earned: false,
                  date: "32/50 completed"
                }
              ].map((achievement, index) => (
                <Card key={index} className={achievement.earned ? "border-green-200 bg-green-50" : "border-gray-200"}>
                  <CardContent className="p-6 text-center">
                    <div className={`mx-auto mb-4 ${achievement.earned ? 'opacity-100' : 'opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{achievement.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <Badge variant={achievement.earned ? "default" : "secondary"}>
                      {achievement.earned ? `Earned ${achievement.date}` : achievement.date}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}