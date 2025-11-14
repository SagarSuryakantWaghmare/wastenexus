"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Images, 
  Plus, 
  Pencil, 
  Trash2,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';

interface GalleryItem {
  _id: string;
  name: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
  createdBy?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

export default function GalleryManagement() {
  const router = useRouter();
  const { token } = useAuth();
  const [galleries, setGalleries] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/admin/gallery', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setGalleries(data.data);
      } else {
        throw new Error('Failed to fetch gallery items');
      }
    } catch (err) {
      console.error('Error fetching galleries:', err);
      setError('Failed to load gallery items');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchGalleries();
    }
  }, [token, fetchGalleries]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this gallery item? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        fetchGalleries();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete gallery item');
      }
    } catch (err) {
      console.error('Error deleting gallery:', err);
      setError('Failed to delete gallery item');
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (response.ok) {
        fetchGalleries();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error toggling status:', err);
      setError('Failed to update status');
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = galleries.findIndex(g => g._id === id);
    if (currentIndex === -1) return;

    const newOrder = direction === 'up' ? galleries[currentIndex].order - 1 : galleries[currentIndex].order + 1;

    try {
      const response = await fetch(`/api/admin/gallery/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ order: newOrder }),
      });

      if (response.ok) {
        fetchGalleries();
      }
    } catch (err) {
      console.error('Error reordering:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
                <Images className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
                  Gallery Management
                </h1>
              </div>
            </div>
            <Button 
              onClick={() => router.push('/dashboard/admin/gallery/create')}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              Create Gallery Item
            </Button>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Manage homepage gallery showcase items and their display order
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline hover:no-underline">Dismiss</button>
          </div>
        )}

        {/* Gallery Items */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <LoaderCircle size="xl" className="mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400 font-medium">Loading gallery items...</p>
            </div>
          </div>
        ) : galleries.length === 0 ? (
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-4">
                <Images className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No gallery items yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-center max-w-md">
                Create your first gallery item to showcase community events and initiatives on the homepage
              </p>
              <Button 
                onClick={() => router.push('/dashboard/admin/gallery/create')}
                className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create First Item
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {galleries.map((item, index) => (
              <Card key={item._id} className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200">
                <CardHeader className="pb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <CardTitle className="text-lg text-gray-900 dark:text-white truncate">
                          {item.name}
                        </CardTitle>
                        <Badge variant={item.isActive ? "default" : "secondary"} className={item.isActive ? "bg-green-600 text-white" : ""}>
                          {item.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {item.title}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(item._id, 'up')}
                        disabled={index === 0}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReorder(item._id, 'down')}
                        disabled={index === galleries.length - 1}
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 flex flex-col min-h-0">
                  <div className="mb-4 w-full aspect-[16/9] md:aspect-[4/3] relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1 mb-4">
                    <p className="flex items-center gap-1">
                      <span className="font-medium">📍</span> {item.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">📅</span> {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className="flex items-center gap-1">
                      <span className="font-medium">Order:</span> {item.order}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(item._id, item.isActive)}
                      className="flex items-center gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      title={item.isActive ? "Hide from homepage" : "Show on homepage"}
                    >
                      {item.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span className="hidden sm:inline">
                        {item.isActive ? 'Hide' : 'Show'}
                      </span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/dashboard/admin/gallery/${item._id}`)}
                      className="flex items-center gap-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Pencil className="w-4 h-4" />
                      <span className="hidden sm:inline">Edit</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Delete</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
