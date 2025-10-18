'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
      setStats(data.stats || stats);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  }, [stats]);

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

      alert(`Job ${status} successfully!`);
      setSelectedJob(null);
      setAdminNotes('');
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      alert('Failed to update job. Please try again.');
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-green-600 dark:text-green-400" />
            Jobs Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Review and verify jobs posted by clients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Pending Review</p>
                  <p className="text-4xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Verified</p>
                  <p className="text-4xl font-bold">{stats.verified}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">Rejected</p>
                  <p className="text-4xl font-bold">{stats.rejected}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Jobs</p>
                  <p className="text-4xl font-bold">{stats.total}</p>
                </div>
                <Briefcase className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Category Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Jobs by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                <Home className="w-8 h-8 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Home</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byCategory.home}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                <Building2 className="w-8 h-8 text-purple-600" />
                <div>
                  <p className="text-sm text-gray-600">Industry</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byCategory.industry}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-8 h-8 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Other</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.byCategory.other}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Jobs</CardTitle>
            <CardDescription>Review and manage job postings</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({stats.verified})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
                <TabsTrigger value="assigned">Assigned ({stats.assigned})</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress ({stats.inProgress})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({stats.completed})</TabsTrigger>
                <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
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
                        className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        {/* Job Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-bold text-xl text-gray-900">{job.title}</h3>
                              <div className="flex items-center gap-2">
                                {/* Category Badge */}
                                {job.category === 'home' && (
                                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                                    <Home className="w-3 h-3 mr-1" /> Home
                                  </Badge>
                                )}
                                {job.category === 'industry' && (
                                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                                    <Building2 className="w-3 h-3 mr-1" /> Industry
                                  </Badge>
                                )}
                                {job.category === 'other' && (
                                  <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                                    <Package className="w-3 h-3 mr-1" /> Other
                                  </Badge>
                                )}
                                
                                {/* Status Badge */}
                                <Badge
                                  className={
                                    job.status === 'pending'
                                      ? 'bg-orange-100 text-orange-700'
                                      : job.status === 'verified'
                                      ? 'bg-green-100 text-green-700'
                                      : job.status === 'rejected'
                                      ? 'bg-red-100 text-red-700'
                                      : job.status === 'assigned'
                                      ? 'bg-blue-100 text-blue-700'
                                      : job.status === 'in-progress'
                                      ? 'bg-purple-100 text-purple-700'
                                      : 'bg-gray-100 text-gray-700'
                                  }
                                >
                                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                                </Badge>

                                {/* Urgency Badge */}
                                {job.urgency === 'high' && (
                                  <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                                    <AlertCircle className="w-3 h-3 mr-1" /> Urgent
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">{job.description}</p>

                            {/* Job Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                              <div className="flex items-start gap-2">
                                <User className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Client</p>
                                  <p className="font-medium text-gray-900">{job.clientId.name}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Location</p>
                                  <p className="font-medium text-gray-900 text-sm">{job.location.address}</p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <Package className="w-4 h-4 text-gray-500 mt-0.5" />
                                <div>
                                  <p className="text-xs text-gray-500">Waste Types</p>
                                  <p className="font-medium text-gray-900 capitalize text-sm">
                                    {job.wasteType.join(', ')}
                                  </p>
                                </div>
                              </div>

                              {job.estimatedWeight && (
                                <div className="flex items-start gap-2">
                                  <Weight className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Est. Weight</p>
                                    <p className="font-medium text-gray-900">{job.estimatedWeight} kg</p>
                                  </div>
                                </div>
                              )}

                              {job.budget && (
                                <div className="flex items-start gap-2">
                                  <DollarSign className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Budget</p>
                                    <p className="font-medium text-green-600">₹{job.budget}</p>
                                  </div>
                                </div>
                              )}

                              {job.scheduledDate && (
                                <div className="flex items-start gap-2">
                                  <Calendar className="w-4 h-4 text-gray-500 mt-0.5" />
                                  <div>
                                    <p className="text-xs text-gray-500">Scheduled</p>
                                    <p className="font-medium text-gray-900 text-sm">
                                      {new Date(job.scheduledDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Contact Info */}
                            {job.clientContact && (
                              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p className="text-sm font-semibold text-gray-700 mb-2">Contact Information:</p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                  <div className="flex items-center gap-2">
                                    <User className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">{job.clientContact.name}</span>
                                  </div>
                                  {job.clientContact.phone && (
                                    <div className="flex items-center gap-2">
                                      <Phone className="w-4 h-4 text-gray-500" />
                                      <span className="text-gray-900">{job.clientContact.phone}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-2">
                                    <Mail className="w-4 h-4 text-gray-500" />
                                    <span className="text-gray-900">{job.clientContact.email}</span>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Admin Notes */}
                            {job.adminNotes && (
                              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                                <p className="text-sm font-semibold text-yellow-800 mb-1">Admin Notes:</p>
                                <p className="text-sm text-yellow-700">{job.adminNotes}</p>
                              </div>
                            )}

                            {/* Posted Date */}
                            <p className="text-xs text-gray-500 mt-3">
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
