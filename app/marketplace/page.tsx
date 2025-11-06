'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import ItemGrid from '@/components/Marketplace/ItemGrid';
import { normalizeMarketplaceList, type NormalizedMarketplaceItem } from '@/lib/marketplace';
import ItemFilters, { FilterValues } from '@/components/Marketplace/ItemFilters';
import SearchBar from '@/components/Marketplace/SearchBar';
import { PageLoader } from '@/components/ui/loader';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function MarketplacePage() {
  const router = useRouter();
  const { user, token } = useAuth();
  const [items, setItems] = useState<NormalizedMarketplaceItem[]>([] as NormalizedMarketplaceItem[]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoritedItems, setFavoritedItems] = useState<string[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const [filters, setFilters] = useState<FilterValues>({
    category: 'all',
    condition: 'all',
    minPrice: 0,
    maxPrice: 100000,
    city: '',
    sort: '-createdAt',
  });

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, searchQuery, pagination.page]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: '12',
        sort: filters.sort,
      });

      if (filters.category !== 'all') params.append('category', filters.category);
      if (filters.condition !== 'all') params.append('condition', filters.condition);
      if (filters.minPrice > 0) params.append('minPrice', filters.minPrice.toString());
      if (filters.maxPrice < 100000) params.append('maxPrice', filters.maxPrice.toString());
      if (filters.city) params.append('city', filters.city);
      if (searchQuery) params.append('search', searchQuery);

      const response = await fetch(`/api/marketplace?${params}`);
      const data = await response.json();

      if (response.ok) {
        setItems(normalizeMarketplaceList(data.items || []));
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async (itemId: string) => {
    if (!token) {
      toast.error('Please log in to favorite items');
      return;
    }

    try {
      const response = await fetch(`/api/marketplace/${itemId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isFavorited) {
          setFavoritedItems([...favoritedItems, itemId]);
          toast.success('Added to favorites');
        } else {
          setFavoritedItems(favoritedItems.filter((id) => id !== itemId));
          toast.success('Removed from favorites');
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to update favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      category: 'all',
      condition: 'all',
      minPrice: 0,
      maxPrice: 100000,
      city: '',
      sort: '-createdAt',
    });
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          {/* Back to Dashboard Button */}
          {user && (
            <div className="mb-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 -ml-2"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">Marketplace</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1">Buy and sell second-hand items sustainably</p>
            </div>
            {user && (
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Link href="/marketplace/my-items">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">My Items</Button>
                </Link>
                <Link href="/marketplace/add">
                  <Button className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm" size="sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    Sell Item
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search for items..."
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden lg:block lg:w-64 flex-shrink-0">
            <ItemFilters
              filters={filters}
              onFilterChange={setFilters}
              onReset={handleResetFilters}
            />
          </aside>

          {/* Filters Modal (Mobile) */}
          <div className="lg:hidden">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700">
                <DialogHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">Filter Items</DialogTitle>
                </DialogHeader>
                <div className="mt-4">
                  <ItemFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                  />
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <PageLoader message="Loading items..." />
              </div>
            ) : (
              <>
                <div className="mb-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  {pagination.total} items found
                </div>
                <ItemGrid
                  items={items}
                  onFavorite={user ? handleFavorite : undefined}
                  favoritedItems={favoritedItems}
                  emptyMessage="No items found matching your criteria"
                />

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                      className="w-full sm:w-auto"
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-3 sm:px-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                      className="w-full sm:w-auto"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
