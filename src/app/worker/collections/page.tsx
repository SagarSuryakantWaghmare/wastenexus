'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  MapPin, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
  Trash2,
  Package,
  Weight,
  Users,
  Calendar,
  Timer,
  Filter,
  ChevronRight,
  Star,
  MessageSquare,
  Upload,
  Eye,
  Navigation
} from "lucide-react";
import { 
  mockCollectionTasks,
  mockWorker,
  type CollectionTask
} from "@/data/mockData";

export default function CollectionTasksPage() {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('tasks');
  const [selectedTask, setSelectedTask] = useState<CollectionTask | null>(null);

  // Filter tasks based on selected status
  const filteredTasks = selectedStatus === 'all' 
    ? mockCollectionTasks 
    : mockCollectionTasks.filter(task => task.status === selectedStatus);

  // Calculate statistics
  const totalTasks = mockCollectionTasks.length;
  const completedTasks = mockCollectionTasks.filter(task => task.status === 'collected').length;
  const pendingTasks = mockCollectionTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = mockCollectionTasks.filter(task => task.status === 'in_progress').length;
  const issuesTasks = mockCollectionTasks.filter(task => task.status === 'issue_reported').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'collected': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'issue_reported': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'missed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'collected': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress': return <Timer className="w-4 h-4 text-blue-500" />;
      case 'issue_reported': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'missed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Collection Tasks</h1>
            <p className="text-gray-600 mt-2">Manage and track waste collection activities</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Users className="w-3 h-3 mr-1" />
              Area: {mockWorker.assigned_area}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              Today
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <Package className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalTasks}</div>
              <p className="text-xs text-gray-500">Assigned today</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
              <p className="text-xs text-gray-500">{Math.round((completedTasks/totalTasks)*100)}% of total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Timer className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
              <p className="text-xs text-gray-500">Currently active</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingTasks}</div>
              <p className="text-xs text-gray-500">Awaiting collection</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{issuesTasks}</div>
              <p className="text-xs text-gray-500">Need attention</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="photos">Photo Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-gray-500" />
                  Filter Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['all', 'pending', 'in_progress', 'collected', 'issue_reported', 'missed'].map((status) => (
                    <Button
                      key={status}
                      variant={selectedStatus === status ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status)}
                      className="capitalize"
                    >
                      {status === 'all' ? 'All Tasks' : status.replace('_', ' ')}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedTask(task)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Trash2 className="h-5 w-5 text-gray-500" />
                          {task.location.address}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <MapPin className="h-3 w-3" />
                          {task.location.lat.toFixed(4)}, {task.location.lng.toFixed(4)}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge className={getStatusColor(task.status)}>
                          {getStatusIcon(task.status)}
                          <span className="ml-1 capitalize">{task.status.replace('_', ' ')}</span>
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className={`h-3 w-3 ${getPriorityColor(task.priority)}`} fill="currentColor" />
                          <span className={`text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Waste Type</p>
                        <p className="font-medium capitalize">{task.waste_type.join(', ').replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Estimated Time</p>
                        <p className="font-medium">{task.estimated_time} min</p>
                      </div>
                    </div>
                    
                    {task.weight_kg && (
                      <div className="flex items-center gap-2 text-sm">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>Est. Weight: {task.weight_kg} kg</span>
                      </div>
                    )}
                    
                    {task.issue_description && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
                        <span className="text-gray-600">{task.issue_description}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between pt-2 border-t">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>
                          {task.collected_at 
                            ? `Completed at ${new Date(task.collected_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                            : `Scheduled: ${new Date(task.scheduled_time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                          }
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            {selectedTask ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Task Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      Task Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedTask.location.address}</p>
                      <p className="text-sm text-gray-500">
                        {selectedTask.location.lat.toFixed(6)}, {selectedTask.location.lng.toFixed(6)}
                      </p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Status</p>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedTask.status)}
                          <span className="font-medium capitalize">
                            {selectedTask.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Priority</p>
                        <div className="flex items-center gap-1">
                          <Star className={`h-4 w-4 ${getPriorityColor(selectedTask.priority)}`} fill="currentColor" />
                          <span className={`font-medium ${getPriorityColor(selectedTask.priority)}`}>
                            {selectedTask.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Waste Type</p>
                        <p className="font-medium capitalize">{selectedTask.waste_type.join(', ').replace(/_/g, ' ')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Estimated Time</p>
                        <p className="font-medium">{selectedTask.estimated_time} minutes</p>
                      </div>
                    </div>
                    
                    {selectedTask.weight_kg && (
                      <div>
                        <p className="text-sm text-gray-600">Estimated Weight</p>
                        <p className="font-medium">{selectedTask.weight_kg} kg</p>
                      </div>
                    )}
                    
                    {selectedTask.issue_description && (
                      <div>
                        <p className="text-sm text-gray-600">Issue Description</p>
                        <p className="font-medium">{selectedTask.issue_description}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Task Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-green-500" />
                      Task Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      {selectedTask.status === 'pending' && (
                        <Button className="w-full">
                          <Timer className="w-4 h-4 mr-2" />
                          Start Collection
                        </Button>
                      )}
                      
                      {selectedTask.status === 'in_progress' && (
                        <>
                          <Button className="w-full">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Collected
                          </Button>
                          <Button variant="outline" className="w-full">
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Report Issue
                          </Button>
                        </>
                      )}
                      
                      <Button variant="outline" className="w-full">
                        <Camera className="w-4 h-4 mr-2" />
                        Take Photo
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <Navigation className="w-4 h-4 mr-2" />
                        Navigate to Location
                      </Button>
                      
                      <Button variant="outline" className="w-full">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Add Note
                      </Button>
                    </div>
                    
                    {selectedTask.status === 'collected' && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 text-green-800">
                          <CheckCircle className="h-4 w-4" />
                          <span className="font-medium">Task Completed</span>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Completed at {selectedTask.collected_at && new Date(selectedTask.collected_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card>
                <CardContent className="py-12">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Task Selected</h3>
                    <p className="text-gray-600">
                      Select a task from the list to view detailed information and available actions.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="photos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-purple-500" />
                  Photo Documentation
                </CardTitle>
                <CardDescription>
                  Document waste collection with before/after photos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Upload Section */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Photos</h3>
                      <p className="text-gray-600 mb-4">
                        Take or upload photos to document collection tasks
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button>
                          <Camera className="w-4 h-4 mr-2" />
                          Take Photo
                        </Button>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload File
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Photo Gallery */}
                  <div>
                    <h4 className="text-lg font-medium mb-4">Recent Photos</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {/* Mock photo entries */}
                      {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                          </div>
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex items-center justify-center">
                            <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="mt-2">
                            <p className="text-sm font-medium">Task #{23456 + i}</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}