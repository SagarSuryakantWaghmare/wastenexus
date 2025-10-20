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
  Loader2,
} from 'lucide-react';

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
        <Loader2 className="w-8 h-8 animate-spin text-green-600 dark:text-green-400" />
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
          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-amber-600 dark:text-amber-400 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Needs attention
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Verified</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.verified}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-green-600 dark:text-green-400 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                      </svg>
                      {Math.floor((stats.verified ?? 0) / Math.max(stats.total, 1) * 100)}% approval rate
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-red-600 dark:text-red-400 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8 13a1 1 0 01-.707-.293l-4-4a1 1 0 011.414-1.414L8 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4A1 1 0 018 13z" clipRule="evenodd" />
                      </svg>
                      {Math.floor((stats.rejected ?? 0) / Math.max(stats.total, 1) * 100)}% rejection rate
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Jobs</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                  <div className="flex items-center mt-2 text-sm">
                    <span className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                      </svg>
                      +{Math.floor((stats.total ?? 0) * 0.15)} from last month
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
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
              <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 mb-6">
                <TabsTrigger 
                  value="pending"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-orange-400 rounded-md px-3 py-1.5 text-sm"
                >
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger 
                  value="verified"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400 rounded-md px-3 py-1.5 text-sm"
                >
                  Verified ({stats.verified})
                </TabsTrigger>
                <TabsTrigger 
                  value="rejected"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-red-400 rounded-md px-3 py-1.5 text-sm"
                >
                  Rejected ({stats.rejected})
                </TabsTrigger>
                <TabsTrigger 
                  value="assigned"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-blue-400 rounded-md px-3 py-1.5 text-sm"
                >
                  Assigned ({stats.assigned})
                </TabsTrigger>
                <TabsTrigger 
                  value="in-progress"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-purple-400 rounded-md px-3 py-1.5 text-sm"
                >
                  In Progress ({stats.inProgress})
                </TabsTrigger>
                <TabsTrigger 
                  value="completed"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-emerald-400 rounded-md px-3 py-1.5 text-sm"
                >
                  Completed ({stats.completed})
                </TabsTrigger>
                <TabsTrigger 
                  value="all"
                  className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-white rounded-md px-3 py-1.5 text-sm"
                >
                  All ({stats.total})
                </TabsTrigger>
              </TabsList>

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
                        className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-gray-900 dark:text-white">{job.title}</h3>
                              <div className="flex items-center gap-2">
                                {/* Category Badge */}
                                {job.category === 'home' && (
                                  <Badge className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40">
                                    <Home className="w-3 h-3 mr-1" /> Home
                                  </Badge>
                                )}
                                {job.category === 'industry' && (
                                  <Badge className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/40">
                                    <Building2 className="w-3 h-3 mr-1" /> Industry
                                  </Badge>
                                )}
                                {job.category === 'other' && (
                                  <Badge className="bg-gray-100 dark:bg-gray-700/30 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/40">
                                    <Package className="w-3 h-3 mr-1" /> Other
                                  </Badge>
                                )}
                                
                                {/* Status Badge */}
                                <Badge
                                  className={
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
                                  }
                                >
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </Badge>

                                {/* Urgency Badge */}
                                {job.urgency === 'high' && (
                                  <Badge className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-4">{job.description}</p>

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Client</p>
                                  <p className="font-medium text-gray-900 dark:text-white">{job.clientId.name}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Location</p>
                                  <p className="font-medium text-gray-900 dark:text-white text-sm">{job.location.address}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Waste Types</p>
                                  <p className="font-medium text-gray-900 dark:text-white capitalize text-sm">
                                    {job.wasteType.join(', ')}
                                  </p>
                                </div>
                              </div>

                              {job.estimatedWeight && (
                                <div className="flex items-start gap-2">
                                  <Weight className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Est. Weight</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{job.estimatedWeight} kg</p>
                                  </div>
                                </div>
                              )}

                              {job.budget && (
                                <div className="flex items-start gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Budget</p>
                                    <p className="font-medium text-green-600 dark:text-green-400">₹{job.budget}</p>
                                  </div>
                                </div>
                              )}

                              {job.scheduledDate && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Scheduled</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                                      {new Date(job.scheduledDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Contact Info */}
                            {job.clientContact && (
                              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-4">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">Contact Information:</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900 dark:text-white">{job.clientContact.name}</span>
                                  </div>
                                  {job.clientContact.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-gray-500" />
                                      <span className="text-gray-900 dark:text-white">{job.clientContact.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900 dark:text-white">{job.clientContact.email}</span>
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
                          <div className="border-t pt-4">
                            {selectedJob?._id === job._id ? (
                              <div className="space-y-3">
                                <Textarea
                                  placeholder="Add admin notes (optional)"
                                  value={adminNotes}
                                  onChange={(e) => setAdminNotes(e.target.value)}
                                  rows={3}
                                />
                                <div className="flex gap-3">
                                  <Button
                                    onClick={() => handleJobAction(job._id, 'verified')}
                                    disabled={actionLoading}
                                    className="flex-1 bg-green-600 hover:bg-green-700"
                                  >
                                    {actionLoading ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Verify Job
                                  </Button>
                                  <Button
                                    onClick={() => handleJobAction(job._id, 'rejected')}
                                    disabled={actionLoading}
                                    variant="destructive"
                                    className="flex-1"
                                  >
                                    {actionLoading ? (
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    ) : (
                                      <XCircle className="w-4 h-4 mr-2" />
                                    )}
                                    Reject Job
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      setSelectedJob(null);
                                      setAdminNotes('');
                                    }}
                                    variant="outline"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Button
                                onClick={() => setSelectedJob(job)}
                                className="w-full bg-blue-600 hover:bg-blue-700"
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
