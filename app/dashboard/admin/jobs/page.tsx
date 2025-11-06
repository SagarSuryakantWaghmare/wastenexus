'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Briefcase,
  CheckCircle,
  XCircle,
  Clock,
  Home,
  Building2,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Weight,
  AlertCircle,
} from 'lucide-react';
import { LoaderCircle, PageLoader } from '@/components/ui/loader';

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
  status: 'pending' | 'verified' | 'rejected' | 'assigned' | 'in-progress' | 'completed';
  clientId: {
    name: string;
    email: string;
    phone?: string;
  };
  clientContact?: {
    name: string;
    phone: string;
    email: string;
  };
  adminNotes?: string;
  createdAt: string;
  scheduledDate?: string;
}

interface Stats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  assigned: number;
  inProgress: number;
  completed: number;
  byCategory: {
    industry: number;
    home: number;
    other: number;
  };
}

export default function AdminJobsPage() {
  // Initialize auth context (user not required here)
  useAuth();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    verified: 0,
    rejected: 0,
    assigned: 0,
    inProgress: 0,
    completed: 0,
    byCategory: { industry: 0, home: 0, other: 0 },
  });
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/jobs', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');
      const data = await response.json();
      setJobs(data.jobs || []);
      setStats(data.stats || {
        total: 0,
        pending: 0,
        verified: 0,
        rejected: 0,
        assigned: 0,
        inProgress: 0,
        completed: 0,
        byCategory: { industry: 0, home: 0, other: 0 },
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobAction = async (jobId: string, status: 'verified' | 'rejected') => {
    try {
      setActionLoading(true);
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/admin/jobs', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId,
          status,
          adminNotes: adminNotes || undefined,
        }),
      });

      if (!response.ok) throw new Error('Failed to update job');

      toast.success(`Job ${status} successfully!`);
      setSelectedJob(null);
      setAdminNotes('');
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'all') return true;
    return job.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <PageLoader message="Loading jobs..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-green-600 dark:text-green-400" />
            Jobs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and verify jobs posted by clients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending Review</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.pending}</p>
                  <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                    <span className="mr-1">⏳</span>
                    <span>Urgent</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-orange-600 dark:text-orange-400 font-medium">{stats.pending}</span> jobs need attention
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
                    <span className="mr-1">+32.5%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">+{Math.floor(stats.verified * 0.32)}</span> from last month
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
                    <span className="mr-1">-12.3%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L12 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 0112 13z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 font-medium">-{Math.floor(stats.rejected * 0.12)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Jobs</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats.total}</p>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span className="mr-1">+28.7%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">+{Math.floor(stats.total * 0.28)}</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <Card className="mb-8 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Jobs by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <Home className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Home</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byCategory.home}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-100 dark:border-purple-800">
                <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Industry</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byCategory.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg border border-gray-100 dark:border-gray-600">
                <Package className="w-8 h-8 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Other</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.byCategory.other}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">All Jobs</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">Review and manage job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto horizontal-scroll pb-2 mb-6">
                <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 inline-flex min-w-max">
                  <TabsTrigger 
                    value="pending"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-orange-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger 
                  value="verified"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  Verified ({stats.verified})
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-red-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  Rejected ({stats.rejected})
                </TabsTrigger>
                <TabsTrigger 
                  value="assigned"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  Assigned ({stats.assigned})
                </TabsTrigger>
                <TabsTrigger 
                  value="in-progress"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-purple-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  In Progress ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-emerald-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                >
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>
              </div>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredJobs.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No jobs found</p>
                    </div>
                  ) : (
                    filteredJobs.map((job) => (
                      <div
                        key={job._id}
                        className="p-4 sm:p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Job Header */}
                        <div className="flex flex-col gap-3 mb-4">
                          <div className="flex-1">
                            <h3 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-2 break-words">{job.title}</h3>
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              {/* Category Badge */}
                              {job.category === 'home' && (
                                <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-xs">
                                  <Home className="w-3 h-3 mr-1" /> Home
                                </Badge>
                              )}
                              {job.category === 'industry' && (
                                <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-xs">
                                  <Building2 className="w-3 h-3 mr-1" /> Industry
                                </Badge>
                              )}
                              {job.category === 'other' && (
                                <Badge className="bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40 text-xs">
                                  <Package className="w-3 h-3 mr-1" /> Other
                                </Badge>
                              )}
                              
                              {/* Status Badge */}
                              <Badge
                                className={`text-xs ${
                                  job.status === 'pending'
                                    ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                                    : job.status === 'verified'
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                    : job.status === 'rejected'
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                    : job.status === 'assigned'
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                                    : job.status === 'in-progress'
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                                    : 'bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300'
                                }`}
                              >
                                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                              </Badge>

                              {/* Urgency Badge */}
                              {job.urgency === 'high' && (
                                <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 text-xs">
                                  <AlertCircle className="w-3 h-3 mr-1" /> Urgent
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 break-words">{job.description}</p>

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Client</p>
                                  <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{job.clientId.name}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Location</p>
                                  <p className="font-medium text-sm text-gray-900 dark:text-white break-words">{job.location.address}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Waste Types</p>
                                  <p className="font-medium text-sm text-gray-900 dark:text-white capitalize break-words">
                                    {job.wasteType.join(', ')}
                                  </p>
                                </div>
                              </div>

                              {job.estimatedWeight && (
                                <div className="flex items-start gap-2">
                                  <Weight className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Est. Weight</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">{job.estimatedWeight} kg</p>
                                  </div>
                                </div>
                              )}

                              {job.budget && (
                                <div className="flex items-start gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Budget</p>
                                    <p className="font-medium text-sm text-green-600 dark:text-green-400">₹{job.budget.toLocaleString()}</p>
                                  </div>
                                </div>
                              )}

                              {job.scheduledDate && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Scheduled</p>
                                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                                      {new Date(job.scheduledDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Contact Info */}
                            {job.clientContact && (
                              <div className="bg-gray-50 dark:bg-gray-700/30 p-3 sm:p-4 rounded-lg mb-4">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Contact Information:</p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 text-sm">
                                  <div className="flex items-center gap-2 min-w-0">
                                    <User className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-900 dark:text-white truncate">{job.clientContact.name}</span>
                                  </div>
                                  {job.clientContact.phone && (
                                    <div className="flex items-center gap-2 min-w-0">
                                      <Phone className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                      <span className="text-gray-900 dark:text-white truncate">{job.clientContact.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2 min-w-0">
                                    <Mail className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                    <span className="text-gray-900 dark:text-white truncate break-all">{job.clientContact.email}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Notes */}
                            {job.adminNotes && (
                              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Admin Notes:</p>
                                <p className="text-sm text-yellow-700 dark:text-yellow-100">{job.adminNotes}</p>
                              </div>
                            )}

                            {/* Posted Date */}
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                              Posted: {new Date(job.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        {/* Action Buttons for Pending Jobs */}
                        {job.status === 'pending' && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                            {selectedJob?._id === job._id ? (
                              <div className="space-y-3">
                                <Textarea
                                  placeholder="Add admin notes (optional)"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  rows={3}
                                  className="text-sm"
                                />
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                                  <Button
                                    onClick={() => handleJobAction(job._id, 'verified')}
                                    disabled={actionLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700 text-xs sm:text-sm py-3 sm:py-2 h-auto min-h-[44px] sm:min-h-[36px]"
                                  >
                                    {actionLoading ? (
                                      <LoaderCircle size="sm" className="mr-2" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
                                    )}
                                    Verify Job
                                  </Button>
                                  <Button
                                    onClick={() => handleJobAction(job._id, 'rejected')}
                                    disabled={actionLoading}
                                    variant="destructive"
                                    className="flex-1 text-xs sm:text-sm py-3 sm:py-2 h-auto min-h-[44px] sm:min-h-[36px]"
                                  >
                                    {actionLoading ? (
                                      <LoaderCircle size="sm" className="mr-2" />
                                    ) : (
                                      <XCircle className="w-4 h-4 sm:w-4 sm:h-4 mr-2" />
                                    )}
                                    Reject Job
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedJob(null);
                                      setAdminNotes('');
                                    }}
                                    variant="outline"
                                    className="sm:flex-initial text-xs sm:text-sm py-3 sm:py-2 h-auto min-h-[44px] sm:min-h-[36px]"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setSelectedJob(job)}
                                size="sm"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:text-white text-xs sm:text-sm"
                              >
                                Review Job
                              </Button>
                            )}
                          </div>
                        )}
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
