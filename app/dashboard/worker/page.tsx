'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
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
  Briefcase,
  Home,
  Building2,
  AlertCircle,
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

interface Job {
  _id: string;
  title: string;
  description: string;
  category: 'industry' | 'home' | 'other';
  location: {
    address: string;
  };
  wasteType: string[];
  estimatedWeight?: number;
  budget?: number;
  urgency: 'low' | 'medium' | 'high';
  status: string;
  clientId: {
    name: string;
    email: string;
  };
  createdAt: string;
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
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'tasks' | 'available-jobs' | 'my-jobs'>('tasks');

  useEffect(() => {
    fetchTasks();
    fetchAvailableJobs();
    fetchMyJobs();
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

  const fetchAvailableJobs = async () => {
    try {
      setJobsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/worker/jobs?view=available', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setJobsLoading(false);
    }
  };

  const fetchMyJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/worker/jobs?view=my-jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch my jobs');
      const data = await response.json();
      setMyJobs(data.jobs || []);
    } catch (error) {
      console.error('Error fetching my jobs:', error);
    }
  };

  const handleJobAction = async (jobId: string, action: 'accept' | 'start' | 'complete') => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/worker/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ jobId, action }),
      });

      if (!response.ok) throw new Error('Failed to update job');
      
      // Refresh job lists
      fetchAvailableJobs();
      fetchMyJobs();
      alert(`Job ${action}ed successfully!`);
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeTab === 'all') return true;
    return task.status === activeTab || (activeTab === 'assigned' && task.status === 'assigned');
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Truck className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            Worker Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Welcome back, {user?.name}! Manage your waste collection tasks.
          </p>
        </div>

        {/* View Switcher */}
        <div className="mb-6 flex gap-4">
          <Button
            onClick={() => setActiveView('tasks')}
            variant={activeView === 'tasks' ? 'default' : 'outline'}
            className={activeView === 'tasks' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            <Truck className="w-4 h-4 mr-2" />
            Collection Tasks
          </Button>
          <Button
            onClick={() => setActiveView('available-jobs')}
            variant={activeView === 'available-jobs' ? 'default' : 'outline'}
            className={activeView === 'available-jobs' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Available Jobs ({jobs.length})
          </Button>
          <Button
            onClick={() => setActiveView('my-jobs')}
            variant={activeView === 'my-jobs' ? 'default' : 'outline'}
            className={activeView === 'my-jobs' ? 'bg-purple-600 hover:bg-purple-700' : ''}
          >
            <Package className="w-4 h-4 mr-2" />
            My Jobs ({myJobs.length})
          </Button>
        </div>

        {/* Stats Cards */}
        {activeView === 'tasks' && (
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
        )}

        {/* Collection Tasks */}
        {activeView === 'tasks' && (
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
        )}

        {/* Available Jobs Section */}
        {activeView === 'available-jobs' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-green-600" />
                Available Jobs
              </CardTitle>
              <CardDescription>
                Browse and accept jobs posted by clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>No available jobs at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-gray-900">{job.title}</h3>
                            <div className="flex items-center gap-2">
                              {job.category === 'home' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Home className="w-3 h-3" /> Home
                                </span>
                              )}
                              {job.category === 'industry' && (
                                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Building2 className="w-3 h-3" /> Industry
                                </span>
                              )}
                              {job.category === 'other' && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Package className="w-3 h-3" /> Other
                                </span>
                              )}
                              {job.urgency === 'high' && (
                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Urgent
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Client:</p>
                              <p className="font-medium text-gray-900">{job.clientId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Waste Types:</p>
                              <p className="font-medium text-gray-900 capitalize">
                                {job.wasteType.join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Location:</p>
                              <p className="font-medium text-gray-900 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location.address}
                              </p>
                            </div>
                            {job.estimatedWeight && (
                              <div>
                                <p className="text-gray-500">Est. Weight:</p>
                                <p className="font-medium text-gray-900">{job.estimatedWeight} kg</p>
                              </div>
                            )}
                            {job.budget && (
                              <div>
                                <p className="text-gray-500">Budget:</p>
                                <p className="font-medium text-green-600">₹{job.budget}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleJobAction(job._id, 'accept')}
                        className="w-full bg-green-600 hover:bg-green-700 mt-4"
                      >
                        Accept Job
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* My Jobs Section */}
        {activeView === 'my-jobs' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-6 h-6 text-purple-600" />
                My Jobs
              </CardTitle>
              <CardDescription>
                Jobs you have accepted and are working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myJobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>You haven&apos;t accepted any jobs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-gray-900">{job.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                job.status === 'assigned'
                                  ? 'bg-orange-100 text-orange-700'
                                  : job.status === 'in-progress'
                                  ? 'bg-purple-100 text-purple-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {job.status === 'assigned'
                                ? 'Assigned'
                                : job.status === 'in-progress'
                                ? 'In Progress'
                                : 'Completed'}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{job.description}</p>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Client:</p>
                              <p className="font-medium text-gray-900">{job.clientId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Location:</p>
                              <p className="font-medium text-gray-900">{job.location.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {job.status === 'assigned' && (
                          <Button
                            onClick={() => handleJobAction(job._id, 'start')}
                            className="flex-1 bg-purple-600 hover:bg-purple-700"
                          >
                            Start Job
                          </Button>
                        )}
                        {job.status === 'in-progress' && (
                          <Button
                            onClick={() => handleJobAction(job._id, 'complete')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Completed
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
}
