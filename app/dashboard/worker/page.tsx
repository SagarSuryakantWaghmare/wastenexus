'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
  Navigation,
  Loader2,
  Briefcase,
  Home,
  Building2,
  AlertCircle,
  Award,
} from 'lucide-react';
import Image from 'next/image';
import { LoaderOne } from '@/components/ui/loader';

interface VerifiedReport {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  weightKg: number;
  status: 'verified';
  pointsAwarded: number;
  imageUrl?: string;
  location?: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  date: string;
  createdAt: string;
  workerCompletedAt?: string | null;
  isCompleted?: boolean;
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
  const [verifiedReports, setVerifiedReports] = useState<VerifiedReport[]>([]);
  const [stats, setStats] = useState({
    totalAssigned: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    totalWeight: 0,
  });
  const [reportsStats, setReportsStats] = useState({
    total: 0,
    totalWeight: 0,
    totalPoints: 0,
  });
  const [typeFilter, setTypeFilter] = useState('all');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [myJobs, setMyJobs] = useState<Job[]>([]);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [activeView, setActiveView] = useState<'tasks' | 'available-jobs' | 'my-jobs'>('tasks');
  const [completingReports, setCompletingReports] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchVerifiedReports();
    fetchTasks();
    fetchAvailableJobs();
    fetchMyJobs();
  }, []);

  const fetchVerifiedReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch('/api/worker/verified-reports', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch verified reports');
      }

      const data = await response.json();
      setVerifiedReports(data.reports || []);
      setReportsStats(data.stats || { total: 0, totalWeight: 0, totalPoints: 0 });
    } catch (error) {
      console.error('Error fetching verified reports:', error);
      setVerifiedReports([]);
    } finally {
      setLoading(false);
    }
  };

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
      toast.success(`Job ${action}ed successfully!`);
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
    }
  };

  const handleCompleteReport = async (reportId: string) => {
    try {
      // Add to completing set
      setCompletingReports(prev => new Set(prev).add(reportId));
      
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/worker/complete-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reportId }),
      });

      if (!response.ok) throw new Error('Failed to complete report');
      
      // Remove from UI immediately (optimistic update)
      setVerifiedReports(prev => prev.filter(report => report._id !== reportId));
      setReportsStats(prev => ({
        ...prev,
        total: Math.max(0, prev.total - 1)
      }));
      
      toast.success('Report marked as completed successfully!');
      
      // Refresh to get accurate data
      fetchVerifiedReports();
    } catch (error) {
      console.error('Error completing report:', error);
      toast.error('Failed to complete report. Please try again.');
    } finally {
      // Remove from completing set
      setCompletingReports(prev => {
        const newSet = new Set(prev);
        newSet.delete(reportId);
        return newSet;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center">
          <LoaderOne />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading worker dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 bg-white dark:bg-gray-800 border-b dark:border-gray-700 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 sm:gap-3">
            <Truck className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
            Worker Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">
            Welcome back, {user?.name}! Manage your waste collection tasks.
          </p>
        </div>

        {/* View Switcher */}
        <div className="mb-4 sm:mb-6 overflow-x-auto pb-2">
          <div className="flex gap-2 sm:gap-3 min-w-max">
            <Button
              onClick={() => setActiveView('tasks')}
              variant={activeView === 'tasks' ? 'default' : 'outline'}
              className={`text-xs sm:text-sm ${activeView === 'tasks' ? 'bg-green-600 hover:bg-green-700' : 'dark:border-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Truck className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Collection Tasks
            </Button>
            <Button
              onClick={() => setActiveView('available-jobs')}
              variant={activeView === 'available-jobs' ? 'default' : 'outline'}
              className={`text-xs sm:text-sm ${activeView === 'available-jobs' ? 'bg-green-600 hover:bg-green-700' : 'dark:border-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Available Jobs ({jobs.length})
            </Button>
            <Button
              onClick={() => setActiveView('my-jobs')}
              variant={activeView === 'my-jobs' ? 'default' : 'outline'}
              className={`text-xs sm:text-sm ${activeView === 'my-jobs' ? 'bg-green-600 hover:bg-green-700' : 'dark:border-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
            >
              <Package className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              My Jobs ({myJobs.length})
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {activeView === 'tasks' && (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Total Tasks</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalAssigned}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center ml-auto">
                  <Package className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Pending</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center ml-auto">
                  <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">In Progress</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center ml-auto">
                  <Navigation className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Completed</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center ml-auto">
                  <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 col-span-2 sm:col-span-2 lg:col-span-1">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="w-full">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Total Weight</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalWeight.toFixed(1)}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-xs">kg collected</p>
                </div>
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center ml-auto">
                  <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        )}

        {/* Collection Tasks - Verified Reports */}
        {activeView === 'tasks' && (
        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white text-xl">Verified Waste Reports</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">All verified waste collection reports in your city</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Total Reports</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{reportsStats.total || 0}</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Total Weight</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{reportsStats.totalWeight.toFixed(1)}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">kg collected</p>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <CardContent className="p-4 sm:p-6">
                  <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm font-medium mb-1">Total Points</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{reportsStats.totalPoints || 0}</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs for filtering */}
            <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full">
              <div className="overflow-x-auto horizontal-scroll pb-2 mb-4 sm:mb-6">
                <TabsList className="h-auto bg-gray-100 dark:bg-gray-700/50 inline-flex min-w-max">
                  <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">All Reports</TabsTrigger>
                  <TabsTrigger value="plastic" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Plastic</TabsTrigger>
                  <TabsTrigger value="cardboard" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Cardboard</TabsTrigger>
                  <TabsTrigger value="e-waste" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">E-Waste</TabsTrigger>
                  <TabsTrigger value="metal" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Metal</TabsTrigger>
                  <TabsTrigger value="glass" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Glass</TabsTrigger>
                  <TabsTrigger value="organic" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Organic</TabsTrigger>
                  <TabsTrigger value="paper" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-800 text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5 sm:py-2">Paper</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={typeFilter}>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-12">
                      <LoaderOne />
                      <p className="mt-4 text-gray-600 dark:text-gray-400">Loading reports...</p>
                    </div>
                  ) : verifiedReports.filter(report => typeFilter === 'all' || report.type === typeFilter).length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No verified reports found</p>
                    </div>
                  ) : (
                    verifiedReports
                      .filter(report => typeFilter === 'all' || report.type === typeFilter)
                      .map((report) => (
                      <div
                        key={report._id}
                        className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                      >
                        {/* Image */}
                        {report.imageUrl && (
                          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={report.imageUrl}
                              alt="Waste report"
                              fill
                              className="object-cover rounded-md border border-gray-200 dark:border-gray-600"
                              sizes="(max-width: 768px) 100vw, 12rem"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg capitalize text-gray-900 dark:text-white">
                                {report.type} Waste
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Reported by: <span className="font-medium">{report.userId?.name}</span> ({report.userId?.email})
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className="border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 bg-green-50 dark:bg-green-900/30"
                            >
                              Verified
                            </Badge>
                          </div>

                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800/50">
                            <div className="flex flex-wrap gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                                <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">{report.weightKg} kg</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Points Awarded:</span>
                                <span className="font-semibold ml-1 text-emerald-600 dark:text-emerald-400 inline-flex items-center">
                                  <Award className="w-3.5 h-3.5 mr-1" />
                                  {report.pointsAwarded} pts
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Date:</span>
                                <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">
                                  {new Date(report.date).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {report.location?.address && (
                              <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
                                <MapPin className="w-4 h-4 mt-0.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                                <span>{report.location.address}</span>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-2">
                              {report.location?.coordinates && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    if (report.location?.coordinates) {
                                      const { lat, lng } = report.location.coordinates;
                                      window.open(
                                        `https://www.google.com/maps?q=${lat},${lng}`,
                                        '_blank'
                                      );
                                    }
                                  }}
                                  className="flex-1 dark:border-gray-600 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
                                >
                                  <MapPin className="w-4 h-4 mr-2" />
                                  Get Directions
                                </Button>
                              )}
                              {report.isCompleted ? (
                                <div className="flex-1 flex items-center justify-center px-4 py-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
                                  <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                                  <span className="text-sm font-medium text-green-700 dark:text-green-300">Completed</span>
                                </div>
                              ) : (
                                <Button
                                  size="sm"
                                  onClick={() => handleCompleteReport(report._id)}
                                  disabled={completingReports.has(report._id)}
                                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {completingReports.has(report._id) ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Completing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Mark Completed
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
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
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Briefcase className="w-6 h-6 text-green-600 dark:text-green-400" />
                Available Jobs
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Browse and accept jobs posted by clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400 mx-auto" />
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>No available jobs at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-2">
                              {job.category === 'home' && (
                                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Home className="w-3 h-3" /> Home
                                </span>
                              )}
                              {job.category === 'industry' && (
                                <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Building2 className="w-3 h-3" /> Industry
                                </span>
                              )}
                              {job.category === 'other' && (
                                <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium flex items-center gap-1">
                                  <Package className="w-3 h-3" /> Other
                                </span>
                              )}
                              {job.urgency === 'high' && (
                                <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium flex items-center gap-1">
                                  <AlertCircle className="w-3 h-3" /> Urgent
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{job.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Client:</p>
                              <p className="font-medium text-gray-900 dark:text-white">{job.clientId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Waste Types:</p>
                              <p className="font-medium text-gray-900 dark:text-white capitalize">
                                {job.wasteType.join(', ')}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Location:</p>
                              <p className="font-medium text-gray-900 dark:text-white flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {job.location.address}
                              </p>
                            </div>
                            {job.estimatedWeight && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Est. Weight:</p>
                                <p className="font-medium text-gray-900 dark:text-white">{job.estimatedWeight} kg</p>
                              </div>
                            )}
                            {job.budget && (
                              <div>
                                <p className="text-gray-500 dark:text-gray-400">Budget:</p>
                                <p className="font-medium text-green-600 dark:text-green-400">₹{job.budget}</p>
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
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-gray-900 dark:text-white">
                <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
                My Jobs
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Jobs you have accepted and are working on
              </CardDescription>
            </CardHeader>
            <CardContent>
              {myJobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>You haven&apos;t accepted any jobs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myJobs.map((job) => (
                    <div
                      key={job._id}
                      className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-xl text-gray-900 dark:text-white">{job.title}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                job.status === 'assigned'
                                  ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                  : job.status === 'in-progress'
                                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              }`}
                            >
                              {job.status === 'assigned'
                                ? 'Assigned'
                                : job.status === 'in-progress'
                                ? 'In Progress'
                                : 'Completed'}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">{job.description}</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Client:</p>
                              <p className="font-medium text-gray-900 dark:text-white">{job.clientId.name}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400">Location:</p>
                              <p className="font-medium text-gray-900 dark:text-white">{job.location.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        {job.status === 'assigned' && (
                          <Button
                            onClick={() => handleJobAction(job._id, 'start')}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <Navigation className="w-4 h-4 mr-2" />
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
