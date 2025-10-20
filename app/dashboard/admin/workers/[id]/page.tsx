"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, MapPin, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WorkerApplication {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  photo?: {
    secure_url: string;
  };
  aadhaarCard?: {
    secure_url: string;
  };
  status: 'pending' | 'verified' | 'rejected';
  appliedAt: string;
  verifiedAt?: string;
  rejectionReason?: string;
}

export default function WorkerApplicationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, token, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [application, setApplication] = useState<WorkerApplication | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user && user.role === 'admin' && params.id) {
      fetchApplicationDetails();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, params.id]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/worker-applications/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        setApplication(data.application);
      } else {
        toast.error("Failed to fetch application details");
        router.push('/dashboard/admin/workers');
      }
    } catch (error) {
      console.error('Error fetching application:', error);
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/worker-applications/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'verify' }),
      });

      if (response.ok) {
        toast.success("Worker application verified successfully!");
        fetchApplicationDetails();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to verify application");
      }
    } catch (error) {
      console.error('Error verifying application:', error);
      toast.error("An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(`/api/admin/worker-applications/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action: 'reject', rejectionReason }),
      });

      if (response.ok) {
        toast.success("Worker application rejected");
        setShowRejectDialog(false);
        fetchApplicationDetails();
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to reject application");
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("An error occurred");
    } finally {
      setProcessing(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user || !application) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/admin/workers')}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Worker Application Details
            </h1>
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
              {application.status.toUpperCase()}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                <CardTitle className="text-gray-900 dark:text-gray-100">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{application.name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{application.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{application.phone}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">{application.address}</p>
                    {application.locationCoordinates && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Coordinates: {application.locationCoordinates.lat.toFixed(6)}, {application.locationCoordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Applied On</p>
                    <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                      {new Date(application.appliedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {application.verifiedAt && (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Verified On</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                        {new Date(application.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                )}

                {application.rejectionReason && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-red-600 dark:text-red-400 font-medium">Rejection Reason</p>
                      <p className="text-sm text-red-700 dark:text-red-300">{application.rejectionReason}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Documents */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Aadhaar Card
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {application.aadhaarCard ? (
                  <div className="relative w-full h-96 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                    <Image
                      src={application.aadhaarCard.secure_url}
                      alt="Aadhaar Card"
                      fill
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">No Aadhaar card uploaded</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                <CardTitle className="text-gray-900 dark:text-gray-100">Applicant Photo</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {application.photo ? (
                  <div className="relative w-full h-64 rounded-lg overflow-hidden">
                    <Image
                      src={application.photo.secure_url}
                      alt={application.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-64 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {application.status === 'pending' && (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700">
                  <CardTitle className="text-gray-900 dark:text-gray-100">Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    onClick={handleVerify}
                    disabled={processing}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Verify Application
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={processing}
                    variant="destructive"
                    className="w-full"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject Application
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent className="bg-white dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100">Reject Application</DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Please provide a reason for rejecting this application
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection..."
                rows={4}
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(false)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                "Confirm Rejection"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
