"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Users, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
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

interface Stats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

export default function WorkerApplicationsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<WorkerApplication[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, verified: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchApplications();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Applications</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Verified</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.verified}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Rejected</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.rejected}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
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
              <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 m-6 mb-0">
                <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                  All ({stats.total})
                </TabsTrigger>
                <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                  Pending ({stats.pending})
                </TabsTrigger>
                <TabsTrigger value="verified" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                  Verified ({stats.verified})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">
                  Rejected ({stats.rejected})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
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
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
