'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Loader2, Eye, Heart, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ItemGrid from '@/components/Marketplace/ItemGrid';

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  sold: number;
  totalViews: number;
  totalFavorites: number;
}

export default function MyItemsPage() {
  const router = useRouter();
  const { user, token, isLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    sold: 0,
    totalViews: 0,
    totalFavorites: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/signin');
    } else if (user) {
      fetchMyItems();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isLoading, router]);

  const fetchMyItems = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/marketplace/my-items', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setItems(data.items);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  // Future functionality - Delete item
  // const handleDelete = async (itemId: string) => {
  //   if (!confirm('Are you sure you want to delete this item?')) return;

  //   try {
  //     const response = await fetch(`/api/marketplace/${itemId}`, {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       },
  //     });

  //     if (response.ok) {
  //       fetchMyItems(); // Refresh the list
  //     } else {
  //       alert('Failed to delete item');
  //     }
  //   } catch (error) {
  //     console.error('Error deleting item:', error);
  //     alert('Failed to delete item');
  //   }
  // };

  // Future functionality - Mark as sold
  // const handleMarkAsSold = async (itemId: string) => {
  //   try {
  //     const response = await fetch(`/api/marketplace/${itemId}`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ status: 'sold' }),
  //     });

  //     if (response.ok) {
  //       fetchMyItems(); // Refresh the list
  //     } else {
  //       alert('Failed to mark item as sold');
  //     }
  //   } catch (error) {
  //     console.error('Error updating item:', error);
  //     alert('Failed to mark item as sold');
  //   }
  // };

  const filteredItems = items.filter((item: { status: string }) => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Link href="/marketplace">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Marketplace
            </Button>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Items</h1>
              <p className="text-gray-600 mt-1">Manage your marketplace listings</p>
            </div>
            <Link href="/marketplace/add">
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Add New Item
              </Button>
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-xs text-gray-600">Total Items</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
              <div className="text-xs text-gray-600">Pending</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
              <div className="text-xs text-gray-600">Approved</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-xs text-gray-600">Rejected</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">{stats.sold}</div>
              <div className="text-xs text-gray-600">Sold</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-blue-600" />
                <div className="text-2xl font-bold text-blue-600">{stats.totalViews}</div>
              </div>
              <div className="text-xs text-gray-600">Total Views</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-red-600" />
                <div className="text-2xl font-bold text-red-600">{stats.totalFavorites}</div>
              </div>
              <div className="text-xs text-gray-600">Favorites</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for filtering */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({stats.pending})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({stats.approved})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({stats.rejected})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({stats.sold})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No items found in this category</p>
                </CardContent>
              </Card>
            ) : (
              <ItemGrid items={filteredItems} showStatus={true} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
