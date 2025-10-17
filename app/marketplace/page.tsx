'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Plus, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import ItemGrid from '@/components/Marketplace/ItemGrid';
import ItemFilters, { FilterValues } from '@/components/Marketplace/ItemFilters';
import SearchBar from '@/components/Marketplace/SearchBar';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

export default function MarketplacePage() {
  const { user, token } = useAuth();
  const [items, setItems] = useState([]);
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
        setItems(data.items);
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
      alert('Please log in to favorite items');
      return;
    }

    try {
      const response = await fetch(`/api/marketplace/${itemId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isFavorited) {
          setFavoritedItems([...favoritedItems, itemId]);
        } else {
          setFavoritedItems(favoritedItems.filter((id) => id !== itemId));
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
              <p className="text-gray-600 mt-1">Buy and sell second-hand items sustainably</p>
            </div>
            {user && (
              <div className="flex gap-3">
                <Link href="/marketplace/my-items">
                  <Button variant="outline">My Items</Button>
                </Link>
                <Link href="/marketplace/add">
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
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

          {/* Filters Sheet (Mobile) */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <ItemFilters
                    filters={filters}
                    onFilterChange={setFilters}
                    onReset={handleResetFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Items Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <p className="mt-4 text-gray-600">Loading items...</p>
              </div>
            ) : (
              <>
                <div className="mb-4 text-sm text-gray-600">
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
                  <div className="mt-8 flex justify-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page === 1}
                      onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                    >
                      Previous
                    </Button>
                    <span className="flex items-center px-4 text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
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
