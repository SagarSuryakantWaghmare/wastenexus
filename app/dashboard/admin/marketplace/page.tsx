'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Loader2, 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Eye,
  MapPin,
  IndianRupee,
  AlertTriangle
} from 'lucide-react';
import Image from 'next/image';

interface MarketplaceItem {
  _id: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  price: number;
  images: string[];
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  sellerName: string;
  sellerContact: string;
  status: string;
  location: {
    address: string;
    city: string;
    state: string;
  };
  views: number;
  createdAt: string;
  rejectionReason?: string;
}

interface Stats {
  overview: {
    totalItems: number;
    pendingItems: number;
    approvedItems: number;
    rejectedItems: number;
    soldItems: number;
    totalViews: number;
  };
  categoryBreakdown: Array<{
    _id: string;
    count: number;
    totalValue: number;
  }>;
  recentItems: Array<{
    _id: string;
    title: string;
    status: string;
    price: number;
    createdAt: string;
  }>;
}

export default function AdminMarketplaceDashboard() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [pendingItems, setPendingItems] = useState<MarketplaceItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes] = await Promise.all([
        fetch('/api/admin/marketplace/pending', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/marketplace/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingItems(pendingData.items);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedItem || !action) return;

    if (action === 'reject' && !rejectionReason.trim()) {
      setAlert({ type: 'error', message: 'Please provide a rejection reason' });
      return;
    }

    setProcessing(true);
    try {
      const response = await fetch(`/api/admin/marketplace/${selectedItem._id}/verify`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          action,
          rejectionReason: action === 'reject' ? rejectionReason : undefined,
        }),
      });

      if (response.ok) {
        setAlert({
          type: 'success',
          message: `Item ${action}d successfully!`,
        });
        setShowDialog(false);
        setSelectedItem(null);
        setRejectionReason('');
        fetchData(); // Refresh data
      } else {
        const data = await response.json();
        setAlert({ type: 'error', message: data.error || `Failed to ${action} item` });
      }
    } catch {
      setAlert({ type: 'error', message: 'An error occurred' });
    } finally {
      setProcessing(false);
    }
  };

  const openVerifyDialog = (item: MarketplaceItem, verifyAction: 'approve' | 'reject') => {
    setSelectedItem(item);
    setAction(verifyAction);
    setShowDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-10 h-10 text-green-600" />
            Marketplace Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Review and manage marketplace listings</p>
        </div>

        {/* Alert */}
        {alert && (
          <Alert className={`mb-6 ${alert.type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <AlertDescription className={alert.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">Total Items</p>
                    <p className="text-3xl font-bold text-blue-900">{stats.overview.totalItems}</p>
                  </div>
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">Pending</p>
                    <p className="text-3xl font-bold text-yellow-900">{stats.overview.pendingItems}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">Approved</p>
                    <p className="text-3xl font-bold text-green-900">{stats.overview.approvedItems}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">Rejected</p>
                    <p className="text-3xl font-bold text-red-900">{stats.overview.rejectedItems}</p>
                  </div>
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600">Sold</p>
                    <p className="text-3xl font-bold text-purple-900">{stats.overview.soldItems}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">Total Views</p>
                    <p className="text-3xl font-bold text-indigo-900">{stats.overview.totalViews}</p>
                  </div>
                  <Eye className="w-8 h-8 text-indigo-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="pending">
              Pending Review ({stats?.overview.pendingItems || 0})
            </TabsTrigger>
            <TabsTrigger value="stats">Statistics & Insights</TabsTrigger>
          </TabsList>

          {/* Pending Items Tab */}
          <TabsContent value="pending">
            {pendingItems.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-600">No pending items to review at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {pendingItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="md:flex">
                      {/* Image Section */}
                      <div className="md:w-1/3 bg-gray-100 relative h-64 md:h-auto">
                        <Image
                          src={item.images[0] || '/placeholder-image.jpg'}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute top-4 left-4 bg-yellow-500">
                          Pending Review
                        </Badge>
                      </div>

                      {/* Content Section */}
                      <div className="md:w-2/3 p-6">
                        <CardHeader className="p-0 mb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-2xl mb-2">{item.title}</CardTitle>
                              <CardDescription className="text-base">
                                {item.description}
                              </CardDescription>
                            </div>
                            <div className="text-right ml-4">
                              <div className="flex items-center text-2xl font-bold text-green-600">
                                <IndianRupee className="w-5 h-5" />
                                {item.price.toLocaleString('en-IN')}
                              </div>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="p-0 space-y-4">
                          {/* Item Details */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600">Category</p>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Condition</p>
                              <Badge variant="outline">{item.condition}</Badge>
                            </div>
                          </div>

                          {/* Seller Info */}
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Seller Information</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {item.sellerName}</p>
                              <p><span className="font-medium">Email:</span> {item.seller.email}</p>
                              <p><span className="font-medium">Contact:</span> {item.sellerContact}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                            <p className="text-sm text-gray-700">
                              {item.location.address}, {item.location.city}, {item.location.state}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={() => openVerifyDialog(item, 'approve')}
                              className="flex-1 bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => openVerifyDialog(item, 'reject')}
                              variant="destructive"
                              className="flex-1"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Reject
                            </Button>
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Category Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Category Breakdown</CardTitle>
                  <CardDescription>Items by category</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.categoryBreakdown.map((cat) => (
                    <div key={cat._id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div>
                        <p className="font-semibold">{cat._id}</p>
                        <p className="text-sm text-gray-600">{cat.count} items</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          ₹{cat.totalValue.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-gray-500">Total Value</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Submissions</CardTitle>
                  <CardDescription>Latest marketplace items</CardDescription>
                </CardHeader>
                <CardContent>
                  {stats?.recentItems.map((item) => (
                    <div key={item._id} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex-1">
                        <p className="font-semibold truncate">{item.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className={
                            item.status === 'pending' ? 'border-yellow-500 text-yellow-700' :
                            item.status === 'approved' ? 'border-green-500 text-green-700' :
                            item.status === 'rejected' ? 'border-red-500 text-red-700' :
                            'border-gray-500 text-gray-700'
                          }
                        >
                          {item.status}
                        </Badge>
                        <p className="font-semibold">₹{item.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Verification Dialog */}
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {action === 'approve' ? 'Approve Item' : 'Reject Item'}
              </DialogTitle>
              <DialogDescription>
                {action === 'approve'
                  ? 'This item will be published to the marketplace.'
                  : 'This item will be rejected and removed from pending.'}
              </DialogDescription>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-semibold text-lg">{selectedItem.title}</p>
                  <p className="text-sm text-gray-600">by {selectedItem.sellerName}</p>
                </div>

                {action === 'reject' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Rejection Reason *
                    </label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Please provide a clear reason for rejection..."
                      rows={4}
                      className="w-full"
                    />
                  </div>
                )}

                {action === 'approve' && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      The seller will be notified and the item will appear in marketplace listings.
                    </AlertDescription>
                  </Alert>
                )}

                {action === 'reject' && (
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      The seller will be notified with your rejection reason.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowDialog(false);
                  setRejectionReason('');
                }}
                disabled={processing}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={processing}
                className={action === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}
                variant={action === 'reject' ? 'destructive' : 'default'}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {action === 'approve' ? 'Approve Item' : 'Reject Item'}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
