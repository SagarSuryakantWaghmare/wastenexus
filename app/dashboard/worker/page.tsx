'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Calendar,
  Navigation,
  Loader2,
} from 'lucide-react';
import Image from 'next/image';

interface CollectionTask {
  _id: string;
  reportId: {
    _id: string;
    type: string;
    weightKg: number;
    imageUrl?: string;
    location: {
      address: string;
      coordinates?: {
        lat: number;
        lng: number;
      };
    };
    userId: {
      name: string;
      email: string;
    };
  };
  status: 'assigned' | 'in-progress' | 'completed';
  assignedDate: string;
  completedDate?: string;
}

export default function WorkerDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<CollectionTask[]>([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    totalWeight: 0,
  });
  const [activeTab, setActiveTab] = useState('assigned');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Fetch tasks from API
      const response = await fetch('/api/worker/tasks', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch tasks');
      }

      const data = await response.json();
      setTasks(data.tasks || []);
      setStats(data.stats || {
        totalAssigned: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        totalWeight: 0,
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      // Set empty state on error
      setTasks([]);
      setStats({
        totalAssigned: 0,
        completed: 0,
        inProgress: 0,
        pending: 0,
        totalWeight: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId: string, status: 'in-progress' | 'completed') => {
    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      // Update task status via API
      const response = await fetch('/api/worker/tasks', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task status');
      }

      const data = await response.json();
      
      // Update local state with the updated task
      setTasks(
        tasks.map((task) =>
          task._id === taskId ? data.task : task
        )
      );

      // Refetch tasks to update statistics
      fetchTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task status. Please try again.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    return task.status === activeTab || (activeTab === 'assigned' && task.status === 'assigned');
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Truck className="w-10 h-10 text-blue-600" />
            Worker Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {user?.name}! Manage your waste collection tasks.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Tasks</p>
                  <p className="text-4xl font-bold">{stats.totalAssigned}</p>
                </div>
                <Package className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Pending</p>
                  <p className="text-4xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">In Progress</p>
                  <p className="text-4xl font-bold">{stats.inProgress}</p>
                </div>
                <Navigation className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Completed</p>
                  <p className="text-4xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">Total Weight</p>
                  <p className="text-4xl font-bold">{stats.totalWeight.toFixed(1)}</p>
                  <p className="text-indigo-100 text-xs">kg collected</p>
                </div>
                <TrendingUp className="w-12 h-12 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Tasks */}
        <Card>
          <CardHeader>
            <CardTitle>Collection Tasks</CardTitle>
            <CardDescription>Manage your assigned waste collection tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="assigned">Assigned ({stats.pending})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="all">All ({stats.totalAssigned})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No tasks found</p>
                    </div>
                  ) : (
                    filteredTasks.map((task) => (
                      <div
                        key={task._id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Image */}
                        {task.reportId.imageUrl && (
                          <div className="relative w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={task.reportId.imageUrl}
                              alt="Waste"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg capitalize">
                                {task.reportId.type} Waste
                              </h3>
                              <p className="text-sm text-gray-600">
                                Reporter: {task.reportId.userId.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                Weight: {task.reportId.weightKg} kg
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                task.status === 'assigned'
                                  ? 'border-orange-500 text-orange-700'
                                  : task.status === 'in-progress'
                                  ? 'border-purple-500 text-purple-700'
                                  : 'border-green-500 text-green-700'
                              }
                            >
                              {task.status === 'assigned'
                                ? 'Pending'
                                : task.status === 'in-progress'
                                ? 'In Progress'
                                : 'Completed'}
                            </Badge>
                          </div>

                          <div className="flex items-start gap-2 mb-3">
                            <MapPin className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                            <p className="text-sm text-gray-700">
                              {task.reportId.location.address}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Assigned: {new Date(task.assignedDate).toLocaleString()}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2 flex-wrap">
                            {task.reportId.location.coordinates && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const { lat, lng } = task.reportId.location.coordinates!;
                                  window.open(
                                    `https://www.google.com/maps?q=${lat},${lng}`,
                                    '_blank'
                                  );
                                }}
                              >
                                <Navigation className="w-4 h-4 mr-1" />
                                Get Directions
                              </Button>
                            )}

                            {task.status === 'assigned' && (
                              <Button
                                size="sm"
                                onClick={() => updateTaskStatus(task._id, 'in-progress')}
                                className="bg-purple-600 hover:bg-purple-700"
                              >
                                Start Collection
                              </Button>
                            )}

                            {task.status === 'in-progress' && (
                              <Button
                                size="sm"
                                onClick={() => updateTaskStatus(task._id, 'completed')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="w-4 h-4 mr-1" />
                                Mark as Completed
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
