"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Clock, CheckCircle, XCircle, Eye, Package, Award, MapPin, User } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

interface WorkerApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo?: {
    secure_url: string;
  };
  aadhaarCard?: {
    secure_url: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  appliedAt: string;
  rejectionReason?: string;
}

interface WorkerTask {
  _id: string;
  workerId: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  reportId: {
    _id: string;
    type: string;
    weightKg: number;
    location?: {
      address: string;
    };
    imageUrl?: string;
    pointsAwarded: number;
    userId: {
      name: string;
      email: string;
    };
  };
  status: 'pending' | 'in-progress' | 'completed';
  completedAt?: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
}

export default function WorkerApplicationsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [tasks, setTasks] = useState<WorkerTask[]>([]);
  const [taskStats, setTaskStats] = useState<TaskStats>({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  // Fetch applications and completed task stats on load or when user changes
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchApplications();
      fetchCompletedTaskStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Fetch full completed tasks list only when tab is active
  useEffect(() => {
    if (user && user.role === 'admin') {
      if (activeTab === 'completed-tasks') {
        fetchTasks();
      } else {
        setTasks([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, user]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/worker-applications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
        setStats(data.stats || { total: 0, pending: 0, verified: 0, rejected: 0 });
      } else {
        toast.error("Failed to fetch applications");
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  // Fetch only the completed task stats (not the full list)
  const fetchCompletedTaskStats = async () => {
    try {
      const response = await fetch(`/api/admin/worker-tasks?filter=completed&statsOnly=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTaskStats(data.stats || { total: 0, pending: 0, inProgress: 0, completed: 0 });
      } else {
        setTaskStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
      }
    } catch (error) {
      setTaskStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
      console.error('Error fetching completed task stats:', error);
    }
  };

  // Fetch the full list of completed tasks (for tab)
  const fetchTasks = async () => {
    try {
      setTasksLoading(true);
      const response = await fetch(`/api/admin/worker-tasks?filter=completed`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else {
        setTasks([]);
      }
    } catch (error) {
      setTasks([]);
      console.error('Error fetching tasks:', error);
    } finally {
      setTasksLoading(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (activeTab === 'all') return true;
    return app.status === activeTab;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            Worker Applications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Review and manage worker applications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Applications</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span className="mr-1">+18.2%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">+{Math.floor(stats.total * 0.18)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
                  <div className="flex items-center text-sm text-yellow-600 dark:text-yellow-400 font-medium">
                    <span className="mr-1">⏳</span>
                    <span>Review</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">{stats.pending}</span> awaiting verification
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Verified</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.verified}</p>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="mr-1">+25.4%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{Math.floor(stats.verified * 0.25)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Rejected</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.rejected}</p>
                  <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
                    <span className="mr-1">-8.5%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 font-medium">-{Math.floor(stats.rejected * 0.085)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications List */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-white">Worker Applications</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto horizontal-scroll pb-2 m-6 mb-0">
                <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 inline-flex min-w-max">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                    All ({stats.total})
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                    Pending ({stats.pending})
                  </TabsTrigger>
                  <TabsTrigger value="verified" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                    Verified ({stats.verified})
                  </TabsTrigger>
                  <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                    Rejected ({stats.rejected})
                  </TabsTrigger>
                  <TabsTrigger value="completed-tasks" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3">
                    Completed Tasks ({taskStats.completed})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab}>
                {activeTab !== 'completed-tasks' ? (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredApplications.length === 0 ? (
                      <div className="text-center py-12 m-6">
                        <Users className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-gray-500 dark:text-gray-400">No applications found</p>
                      </div>
                    ) : (
                      filteredApplications.map((application) => (
                        <div
                          key={application._id}
                          className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex flex-col md:flex-row gap-4">
                            {/* Photo */}
                            {application.photo && (
                              <div className="relative w-24 h-24 rounded-full overflow-hidden flex-shrink-0">
                                <Image
                                  src={application.photo.secure_url}
                                  alt={application.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                            {/* Details */}
                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                                    {application.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{application.email}</p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">{application.phone}</p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={
                                    application.status === 'pending'
                                      ? 'border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
                                      : application.status === 'verified'
                                      ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                                      : 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                                  }
                                >
                                  {application.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                📍 {application.address}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
                                Applied: {new Date(application.appliedAt).toLocaleString()}
                              </p>
                              {application.rejectionReason && (
                                <p className="text-sm text-red-600 dark:text-red-400 mb-3">
                                  Rejection reason: {application.rejectionReason}
                                </p>
                              )}
                              {/* Actions */}
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => router.push(`/dashboard/admin/workers/${application._id}`)}
                                  variant="outline"
                                  size="sm"
                                  className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : null}
              </TabsContent>

              {/* Completed Tasks Tab */}
              <TabsContent value="completed-tasks">
                {tasksLoading ? (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400 mx-auto" />
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.length === 0 ? (
                      <div className="text-center py-12 m-6">
                        <Package className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                        <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No completed tasks found</p>
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task._id}
                          className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className="flex flex-col lg:flex-row gap-4">
                            {/* Report Image */}
                            {task.reportId?.imageUrl && (
                              <div className="relative w-full lg:w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={task.reportId.imageUrl}
                                  alt="Waste report"
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}

                            {/* Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-700">
                                      {task.reportId?.type}
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                                    >
                                      ✓ Completed
                                    </Badge>
                                  </div>

                                  <div className="flex items-center gap-2 mb-2">
                                    <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                    <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-white truncate">
                                      Worker: {task.workerId?.name}
                                    </h3>
                                  </div>

                                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                                    Reporter: {task.reportId?.userId?.name} ({task.reportId?.userId?.email})
                                  </p>
                                </div>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm mb-3">
                                <div>
                                  <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                                  <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">{task.reportId?.weightKg} kg</span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-300">Points:</span>
                                  <span className="font-semibold ml-1 text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                                    <Award className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1" />
                                    {task.reportId?.pointsAwarded} pts
                                  </span>
                                </div>
                                <div>
                                  <span className="text-gray-600 dark:text-gray-300">Contact:</span>
                                  <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">{task.workerId?.phone || 'N/A'}</span>
                                </div>
                              </div>

                              {task.reportId?.location?.address && (
                                <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                                  <MapPin className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                  <span className="break-words">{task.reportId.location.address}</span>
                                </div>
                              )}

                              <div className="text-xs text-gray-500 dark:text-gray-500">
                                <p>Assigned: {new Date(task.createdAt).toLocaleString()}</p>
                                {task.completedAt && (
                                  <p className="text-green-600 dark:text-green-400 font-medium">
                                    ✓ Completed: {new Date(task.completedAt).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
