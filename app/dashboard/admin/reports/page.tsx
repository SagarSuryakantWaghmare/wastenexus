'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, TrendingUp, MapPin, Loader2, CheckCircle, XCircle, Clock, Award } from 'lucide-react';
import Image from 'next/image';

interface Report {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  type: string;
  weightKg: number;
  status: 'pending' | 'verified' | 'rejected';
  pointsAwarded: number;
  imageUrl?: string;
  location?: {
    address: string;
  };
  date: string;
  createdAt: string;
}

interface Stats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
  totalWeight: number;
  totalPoints: number;
}

export default function WasteReportsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [typeBreakdown, setTypeBreakdown] = useState<Record<string, { count: number; weight: number; points: number }>>({});
  const [activeTab, setActiveTab] = useState('all');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setReports(data.reports || []);
        setStats(data.stats || {});
        setTypeBreakdown(data.typeBreakdown || {});
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (reportId: string, points?: number) => {
    try {
      setProcessing(reportId);
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId,
          action: 'verify',
          points,
        }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error verifying report:', error);
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (reportId: string) => {
    try {
      setProcessing(reportId);
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          reportId,
          action: 'reject',
        }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Error rejecting report:', error);
    } finally {
      setProcessing(null);
    }
  };

  const filteredReports = reports.filter((report) => {
    if (activeTab === 'all') return true;
    return report.status === activeTab;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2 sm:gap-3">
              <FileText className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" />
              Waste Reports Management
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Monitor and manage waste collection reports</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Reports</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.total || 0}</p>
                  <div className="flex items-center text-sm text-orange-600 dark:text-orange-400 font-medium">
                    <span className="mr-1">+3.7%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-orange-600 dark:text-orange-400 font-medium">+15</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
              <div className="relative">
                <div className="w-2 h-2 bg-blue-500 rounded-full absolute -top-1 -right-1 animate-ping"></div>
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Pending</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.pending || 0}</p>
                  <div className="flex items-center text-sm text-blue-600 dark:text-blue-400 font-medium">
                    <span className="mr-1">+5.2%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-blue-600 dark:text-blue-400 font-medium">+8</span> from last month
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
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.verified || 0}</p>
                  <div className="flex items-center text-sm text-green-600 dark:text-green-400 font-medium">
                    <span className="mr-1">+2.5%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-green-600 dark:text-green-400 font-medium">+12</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Rejected</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.rejected || 0}</p>
                  <div className="flex items-center text-sm text-red-600 dark:text-red-400 font-medium">
                    <span className="mr-1">-1.8%</span>
                    <svg className="w-4 h-4 transform rotate-180" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-red-600 dark:text-red-400 font-medium">-3</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Weight</p>
                <div className="flex items-end justify-between">
                  <div className="flex items-baseline">
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.totalWeight.toFixed(1) || 0}</p>
                    <span className="ml-1.5 text-sm text-gray-500 dark:text-gray-400">kg</span>
                  </div>
                  <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                    <span className="mr-1">+4.2%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-indigo-600 dark:text-indigo-400 font-medium">+28.5kg</span> from last month
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200 rounded-xl">
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <CardContent className="p-6">
              <div className="flex flex-col">
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">Total Points</p>
                <div className="flex items-end justify-between">
                  <p className="text-3xl font-bold text-gray-800 dark:text-white">{stats?.totalPoints || 0}</p>
                  <div className="flex items-center text-sm text-purple-600 dark:text-purple-400 font-medium">
                    <span className="mr-1">+7.8%</span>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 01.707.293l4 4a1 1 0 01-1.414 1.414L12 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4A1 1 0 0112 7z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    <span className="text-purple-600 dark:text-purple-400 font-medium">+45</span> points earned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card className="mb-6 sm:mb-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="bg-gray-50 dark:bg-gray-800/80 border-b border-gray-100 dark:border-gray-700 rounded-t-lg p-4 sm:p-6">
            <CardTitle className="text-gray-900 dark:text-white text-lg sm:text-xl font-semibold">Waste Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0 bg-white dark:bg-gray-800 rounded-b-lg">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <div className="overflow-x-auto">
                <TabsList className="bg-gray-100 dark:bg-gray-700/50 p-1 h-auto rounded-lg border border-gray-200 dark:border-gray-600 m-4 sm:m-6 mb-0 inline-flex min-w-full sm:min-w-0">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-emerald-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-emerald-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    All ({stats?.total || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="pending" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-yellow-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-yellow-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Pending ({stats?.pending || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="verified" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-green-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-green-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Verified ({stats?.verified || 0})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="rejected" 
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-red-600 dark:data-[state=active]:bg-gray-700 dark:data-[state=active]:text-red-400 rounded-md px-2 sm:px-3 py-1.5 text-xs sm:text-sm whitespace-nowrap"
                  >
                    Rejected ({stats?.rejected || 0})
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredReports.length === 0 ? (
                    <div className="text-center py-12 rounded-lg border-2 border-dashed border-gray-200 dark:border-gray-700 m-4 sm:m-6 bg-white dark:bg-gray-800">
                      <FileText className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No reports found</p>
                    </div>
                  ) : (
                    filteredReports.map((report) => (
                      <div
                        key={report._id}
                        className="flex flex-col md:flex-row gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-gray-100 dark:border-gray-700 shadow-sm"
                      >
                        {/* Image */}
                        {report.imageUrl && (
                          <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                            <div className="relative w-full h-full">
                              <Image
                                src={report.imageUrl}
                                alt="Waste report"
                                fill
                                className="object-cover rounded-md border border-gray-200 dark:border-gray-600"
                                sizes="(max-width: 768px) 100vw, 12rem"
                                priority={false}
                              />
                            </div>
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg capitalize text-gray-900 dark:text-white">{report.type} Waste</h3>
                              <p className="text-sm text-gray-600">
                                Reported by: <span className="font-medium">{report.userId?.name}</span> ({report.userId?.email})
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                report.status === 'pending'
                                  ? 'border-yellow-500 text-yellow-600 dark:border-yellow-400 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30'
                                  : report.status === 'verified'
                                  ? 'border-green-500 text-green-600 dark:border-green-400 dark:text-green-400 bg-green-50 dark:bg-green-900/30'
                                  : 'border-red-500 text-red-600 dark:border-red-400 dark:text-red-400 bg-red-50 dark:bg-red-900/30'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>

                          <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-all duration-200 bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <div className="flex flex-wrap gap-4 text-sm mb-3">
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Weight:</span>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                                  <span className="font-medium text-gray-800 dark:text-gray-100">{report.type}</span> • {report.weightKg} kg
                                  {report.pointsAwarded > 0 && (
                                    <span className="ml-2 inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                                      <Award className="w-3.5 h-3.5 mr-1" />
                                      {report.pointsAwarded} pts
                                    </span>
                                  )}
                                </p>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Points:</span>
                                <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">{report.pointsAwarded}</span>
                              </div>
                              <div>
                                <span className="text-gray-600 dark:text-gray-300">Date:</span>
                                <span className="font-semibold ml-1 text-gray-800 dark:text-gray-100">
                                  {new Date(report.date).toLocaleDateString()}
                                </span>
                              </div>
                              {report.location?.address && (
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                                  <MapPin className="w-4 h-4 mr-1.5 text-emerald-600 dark:text-emerald-400" />
                                  <span>{report.location?.address || 'Location not specified'}</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            {report.status === 'pending' && (
                              <div className="flex gap-2 mt-4 flex-wrap">
                                <Button
                                  onClick={() => handleVerify(report._id)}
                                  disabled={processing === report._id}
                                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                                  size="sm"
                                >
                                  {processing === report._id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Processing...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Verify
                                    </>
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/30"
                                  onClick={() => handleReject(report._id)}
                                  disabled={processing === report._id}
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </Button>
                              </div>
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

        {/* Type Breakdown */}
        {Object.keys(typeBreakdown).length > 0 && (
          <Card className="mt-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="border-b border-gray-100 dark:border-gray-700">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Waste Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {Object.entries(typeBreakdown).map(([type, data]) => (
                  <div 
                    key={type} 
                    className="p-5 bg-white dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-gray-900 dark:text-white capitalize">
                        {type}
                      </h4>
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center border border-emerald-200 dark:border-emerald-800/50">
                        <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Reports</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {data.count}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Weight</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {data.weight.toFixed(1)} kg
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Points</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {data.points}
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 mr-2"></div>
                        {data.count} {data.count === 1 ? 'report' : 'reports'} this month
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
