"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle, XCircle, User, Mail, Phone, MapPin, Calendar, FileText, ZoomIn, ZoomOut, X, Maximize2 } from "lucide-react";
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
  const [photoZoom, setPhotoZoom] = useState(100);
  const [aadhaarZoom, setAadhaarZoom] = useState(100);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showAadhaarModal, setShowAadhaarModal] = useState(false);

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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push('/dashboard/admin/workers')}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Applications
        </Button>

        {/* Header Card */}
        <Card className="mb-6 bg-gradient-to-r from-emerald-500 to-green-600 dark:from-emerald-600 dark:to-green-700 border-none shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Worker Application Details
                </h1>
                <p className="text-emerald-50">Review and manage worker verification</p>
              </div>
              <Badge
                variant="outline"
                className={
                  application.status === 'pending'
                    ? 'border-yellow-300 text-yellow-900 bg-yellow-100 text-lg px-4 py-2'
                    : application.status === 'verified'
                    ? 'border-green-300 text-green-900 bg-green-100 text-lg px-4 py-2'
                    : 'border-red-300 text-red-900 bg-red-100 text-lg px-4 py-2'
                }
              >
                {application.status.toUpperCase()}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800">
                <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                    <User className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Full Name</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{application.name}</p>
                  </div>

                  <div className="space-y-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email Address</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white break-all">{application.email}</p>
                  </div>

                  <div className="space-y-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone Number</p>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{application.phone}</p>
                  </div>

                  <div className="space-y-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Applied On</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {new Date(application.appliedAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="md:col-span-2 space-y-1 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">Address</p>
                    </div>
                    <p className="text-base font-semibold text-gray-900 dark:text-white">{application.address}</p>
                    {application.locationCoordinates && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        📍 Coordinates: {application.locationCoordinates.lat.toFixed(6)}, {application.locationCoordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  {application.verifiedAt && (
                    <div className="md:col-span-2 space-y-1 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-700">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Verified On</p>
                      </div>
                      <p className="text-base font-semibold text-green-700 dark:text-green-300">
                        {new Date(application.verifiedAt).toLocaleString()}
                      </p>
                    </div>
                  )}

                  {application.rejectionReason && (
                    <div className="md:col-span-2 space-y-1 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-2 border-red-200 dark:border-red-700">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                        <p className="text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">Rejection Reason</p>
                      </div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">{application.rejectionReason}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aadhaar Card Document */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    Aadhaar Card Document
                  </CardTitle>
                  {application.aadhaarCard && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAadhaarZoom(Math.max(50, aadhaarZoom - 10))}
                        disabled={aadhaarZoom <= 50}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                        {aadhaarZoom}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAadhaarZoom(Math.min(200, aadhaarZoom + 10))}
                        disabled={aadhaarZoom >= 200}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowAadhaarModal(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {application.aadhaarCard ? (
                  <div className="relative w-full h-[500px] rounded-lg overflow-auto border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                    <div 
                      className="relative w-full h-full flex items-center justify-center p-4"
                      style={{ transform: `scale(${aadhaarZoom / 100})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
                    >
                      <Image
                        src={application.aadhaarCard.secure_url}
                        alt="Aadhaar Card"
                        width={800}
                        height={500}
                        className="object-contain rounded-lg shadow-lg"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 bg-gray-50 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No Aadhaar card uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Photo */}
            <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-800">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                      <User className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    Applicant Photo
                  </CardTitle>
                  {application.photo && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhotoZoom(Math.max(50, photoZoom - 10))}
                        disabled={photoZoom <= 50}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400 min-w-[60px] text-center">
                        {photoZoom}%
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPhotoZoom(Math.min(200, photoZoom + 10))}
                        disabled={photoZoom >= 200}
                        className="h-8 w-8 p-0"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPhotoModal(true)}
                        className="h-8 w-8 p-0"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {application.photo ? (
                  <div className="relative w-full h-80 rounded-lg overflow-auto border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                    <div 
                      className="relative w-full h-full flex items-center justify-center p-4"
                      style={{ transform: `scale(${photoZoom / 100})`, transformOrigin: 'center', transition: 'transform 0.3s ease' }}
                    >
                      <Image
                        src={application.photo.secure_url}
                        alt={application.name}
                        width={400}
                        height={400}
                        className="object-contain rounded-lg shadow-lg"
                        style={{ maxWidth: '100%', height: 'auto' }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-80 bg-gray-100 dark:bg-gray-700/30 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center">
                    <User className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-3" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No photo uploaded</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            {application.status === 'pending' && (
              <Card className="bg-white dark:bg-gray-800 border-2 border-emerald-200 dark:border-emerald-800 shadow-lg">
                <CardHeader className="border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-gray-800 dark:to-gray-800">
                  <CardTitle className="text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    Review Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-3">
                  <Button
                    onClick={handleVerify}
                    disabled={processing}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all py-6 text-lg font-semibold"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Verify Application
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={() => setShowRejectDialog(true)}
                    disabled={processing}
                    variant="destructive"
                    className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl transition-all py-6 text-lg font-semibold"
                  >
                    <XCircle className="mr-2 h-5 w-5" />
                    Reject Application
                  </Button>
                </CardContent>
              </Card>
            )}

            {application.status === 'verified' && (
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-2">Verified Worker</h3>
                  <p className="text-sm text-green-600 dark:text-green-400">This application has been approved</p>
                </CardContent>
              </Card>
            )}

            {application.status === 'rejected' && (
              <Card className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border-2 border-red-300 dark:border-red-700">
                <CardContent className="p-6 text-center">
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600 dark:text-red-400" />
                  <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-2">Rejected</h3>
                  <p className="text-sm text-red-600 dark:text-red-400">This application was not approved</p>
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

      {/* Photo Fullscreen Modal */}
      <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhotoZoom(Math.max(50, photoZoom - 10))}
                disabled={photoZoom <= 50}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <span className="text-white font-semibold min-w-[60px] text-center">
                {photoZoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPhotoZoom(Math.min(200, photoZoom + 10))}
                disabled={photoZoom >= 200}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <div className="w-px h-8 bg-white/30 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPhotoModal(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
              <h3 className="text-white font-semibold text-lg">Applicant Photo - {application.name}</h3>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-8">
              {application.photo && (
                <div 
                  style={{ transform: `scale(${photoZoom / 100})`, transition: 'transform 0.3s ease' }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={application.photo.secure_url}
                    alt={application.name}
                    width={800}
                    height={800}
                    className="rounded-lg shadow-2xl"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Aadhaar Fullscreen Modal */}
      <Dialog open={showAadhaarModal} onOpenChange={setShowAadhaarModal}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full flex flex-col">
            <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-lg p-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAadhaarZoom(Math.max(50, aadhaarZoom - 10))}
                disabled={aadhaarZoom <= 50}
                className="text-white hover:bg-white/20"
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <span className="text-white font-semibold min-w-[60px] text-center">
                {aadhaarZoom}%
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAadhaarZoom(Math.min(200, aadhaarZoom + 10))}
                disabled={aadhaarZoom >= 200}
                className="text-white hover:bg-white/20"
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <div className="w-px h-8 bg-white/30 mx-2" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAadhaarModal(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            <div className="absolute top-4 left-4 z-50 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2">
              <h3 className="text-white font-semibold text-lg">Aadhaar Card - {application.name}</h3>
            </div>
            <div className="flex-1 overflow-auto flex items-center justify-center p-8">
              {application.aadhaarCard && (
                <div 
                  style={{ transform: `scale(${aadhaarZoom / 100})`, transition: 'transform 0.3s ease' }}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={application.aadhaarCard.secure_url}
                    alt="Aadhaar Card"
                    width={1000}
                    height={600}
                    className="rounded-lg shadow-2xl"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
