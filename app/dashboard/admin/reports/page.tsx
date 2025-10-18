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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 dark:from-gray-900 dark:to-orange-950 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <FileText className="w-10 h-10 text-orange-600 dark:text-orange-400" />
            Waste Reports Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor and manage waste collection reports</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Total Reports</p>
                  <p className="text-4xl font-bold">{stats?.total || 0}</p>
                </div>
                <FileText className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
                  <p className="text-4xl font-bold">{stats?.pending || 0}</p>
                </div>
                <Clock className="w-12 h-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Verified</p>
                  <p className="text-4xl font-bold">{stats?.verified || 0}</p>
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
                  <p className="text-4xl font-bold">{stats?.rejected || 0}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Total Weight</p>
                  <p className="text-4xl font-bold">{stats?.totalWeight.toFixed(1) || 0}</p>
                  <p className="text-blue-100 text-xs">kg</p>
                </div>
                <TrendingUp className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Total Points</p>
                  <p className="text-4xl font-bold">{stats?.totalPoints || 0}</p>
                </div>
                <Award className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports List */}
        <Card>
          <CardHeader>
            <CardTitle>All Waste Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All ({stats?.total || 0})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({stats?.pending || 0})</TabsTrigger>
                <TabsTrigger value="verified">Verified ({stats?.verified || 0})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({stats?.rejected || 0})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                <div className="space-y-4">
                  {filteredReports.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p>No reports found</p>
                    </div>
                  ) : (
                    filteredReports.map((report) => (
                      <div
                        key={report._id}
                        className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        {/* Image */}
                        {report.imageUrl && (
                          <div className="relative w-full md:w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={report.imageUrl}
                              alt={report.type}
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}

                        {/* Details */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className="font-semibold text-lg capitalize">{report.type} Waste</h3>
                              <p className="text-sm text-gray-600">
                                Reported by: <span className="font-medium">{report.userId?.name}</span> ({report.userId?.email})
                              </p>
                            </div>
                            <Badge
                              variant="outline"
                              className={
                                report.status === 'pending'
                                  ? 'border-yellow-500 text-yellow-700'
                                  : report.status === 'verified'
                                  ? 'border-green-500 text-green-700'
                                  : 'border-red-500 text-red-700'
                              }
                            >
                              {report.status}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                            <div>
                              <span className="text-gray-600">Weight:</span>
                              <span className="font-semibold ml-1">{report.weightKg} kg</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Points:</span>
                              <span className="font-semibold ml-1">{report.pointsAwarded}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Date:</span>
                              <span className="font-semibold ml-1">
                                {new Date(report.date).toLocaleDateString()}
                              </span>
                            </div>
                            {report.location?.address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-gray-600" />
                                <span className="text-xs truncate">{report.location.address}</span>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          {report.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleVerify(report._id)}
                                disabled={processing === report._id}
                                className="bg-green-600 hover:bg-green-700"
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
                                onClick={() => handleReject(report._id)}
                                disabled={processing === report._id}
                                variant="destructive"
                                size="sm"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Reject
                              </Button>
                            </div>
                          )}
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
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Waste Type Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(typeBreakdown).map(([type, data]) => (
                  <div key={type} className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold capitalize mb-2">{type}</h4>
                    <div className="space-y-1 text-sm">
                      <p className="text-gray-600">
                        Reports: <span className="font-semibold text-gray-900">{data.count}</span>
                      </p>
                      <p className="text-gray-600">
                        Weight: <span className="font-semibold text-gray-900">{data.weight.toFixed(1)} kg</span>
                      </p>
                      <p className="text-gray-600">
                        Points: <span className="font-semibold text-gray-900">{data.points}</span>
                      </p>
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
