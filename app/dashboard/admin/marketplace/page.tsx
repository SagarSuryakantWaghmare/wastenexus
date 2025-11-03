'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Eye,
  MapPin,
  IndianRupee,
  RefreshCw,
  Search
} from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import { normalizeMarketplaceList } from '@/lib/marketplace';
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
    // Add comparison data
    comparison: {
      totalItems: { change: number; isPositive: boolean };
      pendingItems: { change: number; isPositive: boolean };
      approvedItems: { change: number; isPositive: boolean };
      rejectedItems: { change: number; isPositive: boolean };
      soldItems: { change: number; isPositive: boolean };
      totalViews: { change: number; isPositive: boolean };
    };
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
  const [refreshing, setRefreshing] = useState(false);
  const [pendingItems, setPendingItems] = useState<MarketplaceItem[]>([]);
  const [allItems, setAllItems] = useState<MarketplaceItem[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [action, setAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [itemsFilter, setItemsFilter] = useState('all');

  // Helper function to format price with 'k' suffix for desktop
  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}k`;
    }
    return price.toString();
  };
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const [pendingRes, allItemsRes, statsRes] = await Promise.all([
        fetch('/api/admin/marketplace/pending', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/marketplace', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/admin/marketplace/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingItems(normalizeMarketplaceList(pendingData.items || []));
      }

      if (allItemsRes.ok) {
        const allItemsData = await allItemsRes.json();
        setAllItems(normalizeMarketplaceList(allItemsData.items || []));
        if (allItemsData.stats) {
          setStats({
            overview: allItemsData.stats,
            categoryBreakdown: allItemsData.categoryBreakdown,
            recentItems: [],
          });
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleVerify = async () => {
    if (!selectedItem || !action) return;

    if (action === 'reject' && !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
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
        toast.success(`Item ${action}d successfully!`);
        setShowDialog(false);
        setSelectedItem(null);
        setRejectionReason('');
        fetchData(); // Refresh data
      } else {
        const data = await response.json();
        toast.error(data.error || `Failed to ${action} item`);
      }
    } catch {
      toast.error('An error occurred');
    } finally {
      setProcessing(false);
    }
  };

  const openVerifyDialog = (item: MarketplaceItem, verifyAction: 'approve' | 'reject') => {
    setSelectedItem(item);
    setAction(verifyAction);
    setShowDialog(true);
  };

  const openDetailsDialog = (item: MarketplaceItem) => {
    setSelectedItem(item);
    setShowDetailsDialog(true);
  };

  const filteredAllItems = allItems.filter((item) => {
    // Filter by status
    const matchesFilter = itemsFilter === 'all' || item.status === itemsFilter;
    
    // Filter by search query if provided
    if (searchQuery.trim() === '') return matchesFilter;
    
    const query = searchQuery.toLowerCase();
    return matchesFilter && (
      (item.title && item.title.toLowerCase().includes(query)) ||
      (item.description && item.description.toLowerCase().includes(query)) ||
      (item.category && item.category.toLowerCase().includes(query)) ||
      (item.sellerName && item.sellerName.toLowerCase().includes(query)) ||
      (item.location?.city && item.location.city.toLowerCase().includes(query)) ||
      (item.location?.state && item.location.state.toLowerCase().includes(query))
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <ShoppingBag className="w-8 h-8 text-green-600" />
                Marketplace Admin
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">Manage and monitor all marketplace listings</p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchData(true)}
                disabled={refreshing}
              >
                {refreshing ? (
                  <>
                    <LoaderCircle size="sm" className="mr-2" />
                    Refreshing...
                  </>
                ) : (
                  <>
                    <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                    Refresh
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        {stats && (
          <div className="overflow-x-auto mb-8">
            <div className="grid grid-cols-2 min-w-[500px] sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4 flex-nowrap" style={{ display: 'grid' }}>
            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400">Total Items</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.totalItems || 0}</p>
                    {stats.overview.comparison?.totalItems ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.totalItems.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.totalItems.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.totalItems.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30">
                    <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-amber-600 dark:text-amber-400">Pending</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.pendingItems || 0}</p>
                    {stats.overview.comparison?.pendingItems ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.pendingItems.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.pendingItems.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.pendingItems.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 dark:text-amber-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-green-600 dark:text-green-400">Approved</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.approvedItems || 0}</p>
                    {stats.overview.comparison?.approvedItems ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.approvedItems.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.approvedItems.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.approvedItems.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-red-600 dark:text-red-400">Rejected</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.rejectedItems || 0}</p>
                    {stats.overview.comparison?.rejectedItems ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.rejectedItems.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.rejectedItems.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.rejectedItems.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 dark:text-red-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-purple-600 dark:text-purple-400">Sold</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.soldItems || 0}</p>
                    {stats.overview.comparison?.soldItems ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.soldItems.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.soldItems.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.soldItems.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 backdrop-blur-sm">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-cyan-600 dark:text-cyan-400">Total Views</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.overview.totalViews || 0}</p>
                    {stats.overview.comparison?.totalViews ? (
                      <div className={`mt-1 flex items-center text-xs ${stats.overview.comparison.totalViews.isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                        {stats.overview.comparison.totalViews.isPositive ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingUp className="w-3 h-3 mr-1 transform rotate-180" />
                        )}
                        {Math.abs(stats.overview.comparison.totalViews.change || 0)}% from last period
                      </div>
                    ) : (
                      <div className="mt-1 h-4"></div>
                    )}
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-900/20">
                    <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="overflow-x-auto pb-2 mb-6">
            <TabsList className="inline-flex items-center gap-2 rounded-lg p-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm min-w-max">
              <TabsTrigger
                value="pending"
                className="px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/50 dark:data-[state=active]:text-green-400 transition-colors whitespace-nowrap"
              >
                Pending Review ({stats?.overview.pendingItems || 0})
              </TabsTrigger>
              <TabsTrigger
                value="allItems"
                className="px-3 py-1 rounded-md text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=active]:bg-input/30 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 whitespace-nowrap"
              >
                All Items ({stats?.overview.totalItems || 0})
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="px-3 py-1 rounded-md text-xs sm:text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 data-[state=active]:bg-input/30 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100 whitespace-nowrap"
              >
                Statistics & Insights
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Pending Items Tab */}
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-2">
            <div className="flex items-center space-x-2 w-full overflow-x-auto">
              <h3 className="text-lg font-medium">
                {activeTab === 'pending' && 'Pending Approvals'}
                {activeTab === 'allItems' && 'All Listings'}
                {activeTab === 'stats' && 'Statistics & Insights'}
              </h3>
              <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800">
                {activeTab === 'pending' && pendingItems.length}
                {activeTab === 'allItems' && allItems.length}
                {activeTab === 'stats' && 'View'}
              </Badge>
            </div>
            <div className="flex items-center space-x-2 w-full overflow-x-auto">
              {activeTab !== 'stats' && (
                <div className="relative min-w-[200px] max-w-xs w-full">
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-sm w-full"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              )}
              <div className="relative min-w-[100px]">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-300 dark:border-gray-600 w-full"
                  onClick={() => fetchData(true)}
                  disabled={refreshing}
                >
                  {refreshing ? (
                    <>
                      <LoaderCircle size="sm" className="mr-2" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                      Refresh
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <TabsContent value="pending">
            {pendingItems.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50 mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
                  <p className="text-gray-500 dark:text-gray-400">No pending items to review at the moment.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <div className="md:flex">
                      {/* Image Section */}
                      <div className="md:w-1/3 bg-gray-100 dark:bg-gray-700 relative h-64 md:h-auto">
                        <Image
                          src={(item.images && item.images[0]) || '/placeholder-image.jpg'}
                          alt={item.title || 'Item'}
                          fill
                          className="object-cover"
                        />
                        <Badge 
                          className={`absolute top-4 left-4 ${
                            item.status === 'approved' 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                              : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              : item.status === 'sold'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                          }`}
                        >
                          {item.status?.charAt(0).toUpperCase() + item.status?.slice(1) || 'Pending Review'}
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
                                <span className="lg:hidden">{item.price ? item.price.toLocaleString('en-IN') : '0'}</span>
                                <span className="hidden lg:inline">{item.price ? formatPrice(item.price) : '0'}</span>
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
                          <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <p className="text-sm font-semibold text-gray-900 mb-2">Seller Information</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Name:</span> {item.sellerName || 'Unknown'}</p>
                              <p><span className="font-medium">Email:</span> {item.seller?.email || 'N/A'}</p>
                              <p><span className="font-medium">Contact:</span> {item.sellerContact || 'N/A'}</p>
                            </div>
                          </div>

                          {/* Location */}
                          {item.location && (
                            <div className="flex items-start gap-2">
                              <MapPin className="w-4 h-4 text-gray-600 mt-0.5" />
                              <p className="text-sm text-gray-700">
                                {item.location.address || 'N/A'}, {item.location.city || ''}, {item.location.state || ''}
                              </p>
                            </div>
                          )}

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

          {/* All Items Tab */}
          <TabsContent value="allItems">
            <Card className="mb-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
              <CardHeader className="p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <CardTitle className="text-base font-medium text-gray-900 dark:text-white">Filter by Status</CardTitle>
                  <div className="w-full overflow-x-auto pb-2 relative" style={{ WebkitOverflowScrolling: 'touch', overflowX: 'auto', msOverflowStyle: 'scrollbar', scrollbarWidth: 'auto' }}>
                    {/* Gradient fade for scroll indicator */}
                    <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10" />
                    <div className="flex flex-nowrap gap-2 min-w-[400px] pr-8" style={{ width: 'max-content' }}>
                      {[
                        // { value: 'all', label: 'All' },
                        { value: 'pending', label: 'Pending' },
                        { value: 'approved', label: 'Approved' },
                        { value: 'rejected', label: 'Rejected' },
                        { value: 'sold', label: 'Sold' }
                      ].map((filter) => (
                        <button
                          key={filter.value}
                          onClick={() => setItemsFilter(filter.value as string)}
                          className={`px-3 py-1.5 text-sm rounded-md transition-colors min-w-[80px] ${
                            itemsFilter === filter.value
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400'
                              : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          {filter.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {filteredAllItems.length === 0 ? (
              <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700/50 mb-4">
                    <ShoppingBag className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Items Found</h3>
                  <p className="text-gray-500 dark:text-gray-400">No marketplace items match your filter.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAllItems.map((item) => (
                  <Card key={item._id} className="overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    {/* Image */}
                    <div className="relative h-48 bg-gray-100">
                      <Image
                        src={(item.images && item.images[0]) || '/placeholder-image.jpg'}
                        alt={item.title || 'Item'}
                        fill
                        className="object-cover"
                      />
                      <Badge
                        className={`absolute top-4 left-4 ${
                          item.status === 'pending'
                            ? 'bg-yellow-500'
                            : item.status === 'approved'
                            ? 'bg-green-500'
                            : item.status === 'rejected'
                            ? 'bg-red-500'
                            : 'bg-purple-500'
                        }`}
                      >
                        {item.status}
                      </Badge>
                      {item.images && item.images.length > 1 && (
                        <Badge className="absolute top-4 right-4 bg-black/70">
                          +{item.images.length - 1}
                        </Badge>
                      )}
                    </div>

                    {/* Content */}
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-1">{item.title || 'Untitled'}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {item.description || 'No description'}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-3">
                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Price</span>
                          <div className="flex items-center text-xl font-bold text-green-600">
                            <IndianRupee className="w-4 h-4" />
                            <span className="lg:hidden">{item.price ? item.price.toLocaleString('en-IN') : '0'}</span>
                            <span className="hidden lg:inline">{item.price ? formatPrice(item.price) : '0'}</span>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <span className="text-gray-600">Category</span>
                            <p className="font-medium">{item.category || 'N/A'}</p>
                          </div>
                          <div>
                            <span className="text-gray-600">Condition</span>
                            <p className="font-medium">{item.condition || 'N/A'}</p>
                          </div>
                        </div>

                        {/* Seller & Views */}
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-gray-600">{item.sellerName || 'Unknown'}</span>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Eye className="w-4 h-4" />
                            {item.views || 0}
                          </div>
                        </div>

                        {/* View Details Button */}
                        <Button
                          onClick={() => openDetailsDialog(item)}
                          variant="outline"
                          className="w-full"
                        >
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Statistics Tab */}
          <TabsContent value="stats">
            <div className="space-y-6">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {[
                  { 
                    title: 'Total Items', 
                    value: stats?.overview?.totalItems || 0,
                    icon: <ShoppingBag className="w-5 h-5 text-green-600 dark:text-green-400" />,
                    bgColor: 'bg-green-100 dark:bg-green-900/20'
                  },
                  { 
                    title: 'Pending', 
                    value: stats?.overview?.pendingItems || 0,
                    icon: <Clock className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />,
                    bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
                  },
                  { 
                    title: 'Approved', 
                    value: stats?.overview?.approvedItems || 0,
                    icon: <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
                    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
                  },
                  { 
                    title: 'Total Views', 
                    value: stats?.overview?.totalViews || 0,
                    icon: <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
                    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
                  }
                ].map((stat, index) => (
                  <Card key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{stat.title}</p>
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value.toLocaleString()}</p>
                        </div>
                        <div className={`${stat.bgColor} p-3 rounded-lg`}>
                          {stat.icon}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Category Breakdown */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-medium text-gray-900 dark:text-white">Category Breakdown</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Items by category</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {stats?.categoryBreakdown?.map((cat, index, array) => (
                      <div 
                        key={cat._id} 
                        className={`flex items-center justify-between p-4 ${index !== array.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{cat._id}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{cat.count} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600 dark:text-green-400">
                            ₹{cat.totalValue.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Recent Items */}
                <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
                  <CardHeader className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-base font-medium text-gray-900 dark:text-white">Recent Submissions</CardTitle>
                        <CardDescription className="text-sm text-gray-500 dark:text-gray-400">Latest marketplace items</CardDescription>
                      </div>
                      <Button variant="outline" size="sm" className="text-xs">
                        View All
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {stats?.recentItems?.map((item, index, array) => (
                      <div 
                        key={item._id} 
                        className={`flex items-center justify-between p-4 ${index !== array.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">{item.title}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 ml-4">
                          <Badge
                            variant="outline"
                            className={
                              item.status === 'pending' ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400' :
                              item.status === 'approved' ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400' :
                              item.status === 'rejected' ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400' :
                              'bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-400'
                            }
                          >
                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                          </Badge>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            ₹<span className="lg:hidden">{item.price ? item.price.toLocaleString('en-IN') : '0'}</span>
                            <span className="hidden lg:inline">{item.price ? formatPrice(item.price) : '0'}</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
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
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-green-800 dark:text-green-300">
                      The seller will be notified and the item will appear in marketplace listings.
                    </p>
                  </div>
                )}

                {action === 'reject' && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-lg flex items-start gap-3">
                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-300">
                      The seller will be notified with your rejection reason.
                    </p>
                  </div>
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
                    <LoaderCircle size="sm" className="mr-2" />
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

        {/* Item Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
            <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-green-600 dark:text-green-400" />
                Item Details
              </DialogTitle>
            </DialogHeader>

            {selectedItem && (
              <div className="space-y-6 py-4">
                {/* Images Gallery */}
                {selectedItem.images && selectedItem.images.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                      <span className="w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full"></span>
                      Images
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      {selectedItem.images.map((img, index) => (
                        <div key={index} className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                          <Image
                            src={img}
                            alt={`${selectedItem.title || 'Item'} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Item Information Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700 space-y-5">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <span className="w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full"></span>
                      Title
                    </h3>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{selectedItem.title}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <span className="w-1 h-6 bg-green-600 dark:bg-green-400 rounded-full"></span>
                      Description
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{selectedItem.description}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Price</h4>
                      <div className="flex items-center text-green-600 dark:text-green-400 text-xl font-bold">
                        ₹<span className="lg:hidden">{selectedItem.price ? selectedItem.price.toLocaleString('en-IN') : '0'}</span>
                        <span className="hidden lg:inline">{selectedItem.price ? formatPrice(selectedItem.price) : '0'}</span>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Category</h4>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedItem.category}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Condition</h4>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{selectedItem.condition}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">Status</h4>
                      <Badge
                        className={
                          selectedItem.status === 'pending'
                            ? 'bg-yellow-500 hover:bg-yellow-600 text-white border-0'
                            : selectedItem.status === 'approved'
                            ? 'bg-green-500 hover:bg-green-600 text-white border-0'
                            : selectedItem.status === 'rejected'
                            ? 'bg-red-500 hover:bg-red-600 text-white border-0'
                            : 'bg-purple-500 hover:bg-purple-600 text-white border-0'
                        }
                      >
                        {selectedItem.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Seller Information Card */}
                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-4">
                    <span className="w-1 h-6 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                    Seller Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Name</span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">{selectedItem.sellerName || 'Unknown'}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1 break-all">{selectedItem.seller?.email || 'N/A'}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Contact</span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-1">{selectedItem.sellerContact || 'N/A'}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Views</span>
                      <div className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mt-1">
                        <Eye className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        {selectedItem.views || 0}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Card */}
                {selectedItem.location && (
                  <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                      <span className="w-1 h-6 bg-purple-600 dark:bg-purple-400 rounded-full"></span>
                      Location
                    </h3>
                    <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm">
                      <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-gray-900 dark:text-white font-medium">
                        {selectedItem.location.address || 'N/A'}, {selectedItem.location.city || ''}, {selectedItem.location.state || ''}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejection Reason (if applicable) */}
                {selectedItem.status === 'rejected' && selectedItem.rejectionReason && (
                  <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 mb-3">
                      <XCircle className="w-6 h-6" />
                      Rejection Reason
                    </h3>
                    <p className="text-red-900 dark:text-red-200 bg-white dark:bg-gray-800 p-4 rounded-lg border border-red-300 dark:border-red-700 font-medium">
                      {selectedItem.rejectionReason}
                    </p>
                  </div>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <Clock className="w-4 h-4" />
                  <p>Listed on: <span className="font-medium text-gray-900 dark:text-white">{new Date(selectedItem.createdAt).toLocaleString()}</span></p>
                </div>

                {/* Actions for pending items */}
                {selectedItem.status === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t-2 border-gray-200 dark:border-gray-700">
                    <Button
                      onClick={() => {
                        setShowDetailsDialog(false);
                        openVerifyDialog(selectedItem, 'approve');
                      }}
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Approve Item
                    </Button>
                    <Button
                      onClick={() => {
                        setShowDetailsDialog(false);
                        openVerifyDialog(selectedItem, 'reject');
                      }}
                      variant="destructive"
                      className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-semibold py-6 text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      <XCircle className="w-5 h-5 mr-2" />
                      Reject Item
                    </Button>
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowDetailsDialog(false)}
                className="border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white font-medium px-6"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
