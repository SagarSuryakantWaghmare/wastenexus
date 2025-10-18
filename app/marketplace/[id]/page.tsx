'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Heart, MapPin, Eye, Phone, ShoppingCart, Check, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { normalizeMarketplaceItem } from '@/lib/marketplace';
import ConditionBadge from '@/components/Marketplace/ConditionBadge';
import PriceDisplay from '@/components/Marketplace/PriceDisplay';

interface MarketplaceItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';
  category: string;
  location: {
    address: string;
    city: string;
    state: string;
    pincode?: string;
  };
  seller: {
    _id: string;
    name: string;
  };
  sellerContact: string;
  isNegotiable: boolean;
  views: number;
  favorites: string[];
  status: string;
  createdAt: string;
  tags?: string[];
}

export default function ItemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, token } = useAuth();
  const itemId = params.id as string;

  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showBuyDialog, setShowBuyDialog] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerContact, setBuyerContact] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Helper to safely extract id/_id from unknown objects
  const getIdFrom = (obj: unknown): string | undefined => {
    if (!obj) return undefined;
    const record = obj as unknown as Record<string, unknown>;
    const id = record['id'] ?? record['_id'];
    return typeof id === 'string' ? id : undefined;
  };

  useEffect(() => {
    if (user) {
      setBuyerName(user.name || '');
      setBuyerContact(user.email || '');
    }
  }, [user]);

  useEffect(() => {
    fetchItemDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId]);

  const fetchItemDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/marketplace/${itemId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (response.ok) {
        const data = await response.json();
        // API may return { item, similarItems } or item directly
        const rawItem = (data && data.item) ? data.item : data;
        const normalized = normalizeMarketplaceItem(rawItem);
        setItem(normalized);
        // Safely check favorites (normalized.favorites is always an array)
        const userId = getIdFrom(user);
        if (userId && normalized.favorites.includes(userId)) {
          setIsFavorited(true);
        }
      } else {
        toast.error('Failed to load item details');
        router.push('/marketplace');
      }
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Failed to load item details');
    } finally {
      setLoading(false);
    }
  };

  const handleFavorite = async () => {
    if (!token) {
      toast.error('Please log in to favorite items');
      return;
    }

    try {
      const response = await fetch(`/api/marketplace/${itemId}/favorite`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFavorited(data.isFavorited);
        toast.success(data.isFavorited ? 'Added to favorites' : 'Removed from favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    }
  };

  const handleBuyClick = () => {
    if (!token) {
      toast.error('Please log in to buy items');
      router.push('/auth/login');
      return;
    }

  // Normalize seller and user id (seller may be an object or a string)
  const sellerId = getIdFrom(item?.seller);
  const currentUserId = getIdFrom(user);

    if (sellerId && currentUserId && sellerId === currentUserId) {
      toast.error('You cannot buy your own item');
      return;
    }

    if (item?.status === 'sold') {
      toast.error('This item has already been sold');
      return;
    }

    setShowBuyDialog(true);
  };

  const handleBuySubmit = async () => {
    if (!buyerName.trim() || !buyerContact.trim()) {
      toast.error('Please fill in all contact details');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/marketplace/${itemId}/buy`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          buyerName,
          buyerContact,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Purchase request sent! The seller will contact you soon.');
        setShowBuyDialog(false);
        fetchItemDetails(); // Refresh item details
      } else {
        toast.error(data.message || 'Failed to process purchase');
      }
    } catch (error) {
      console.error('Error buying item:', error);
      toast.error('Failed to process purchase');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 dark:border-green-400"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Item not found</h2>
          <Link href="/marketplace">
            <Button>Back to Marketplace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = item.status === 'sold';
  const sellerId = item.seller?._id ?? '';
  const isOwnItem = getIdFrom(user) === sellerId;

  // Safely handle images array
  const images = Array.isArray(item.images) && item.images.length > 0 ? item.images : ['/placeholder-image.jpg'];
  const safeSelectedImage = selectedImage < images.length ? selectedImage : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link href="/marketplace">
          <Button variant="ghost" className="mb-6 dark:text-gray-100 dark:hover:bg-gray-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Marketplace
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <Card className="overflow-hidden border-0 shadow-lg dark:bg-gray-800 dark:border-gray-700">
              <div className="relative h-96 bg-gray-100 dark:bg-gray-700">
                <Image
                  src={images[safeSelectedImage]}
                  alt={item.title}
                  fill
                  className="object-contain"
                  priority
                />
                {isSoldOut && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge className="text-2xl px-6 py-2 bg-red-500 text-white">SOLD OUT</Badge>
                  </div>
                )}
              </div>
            </Card>

            {/* Thumbnail Images */}
            {images.length > 1 && images[0] !== '/placeholder-image.jpg' && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      safeSelectedImage === index
                        ? 'border-green-500 dark:border-green-400 scale-105'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                    }`}
                  >
                    <Image src={image} alt={`${item.title} ${index + 1}`} fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Title & Category */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  {item.category}
                </Badge>
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 text-sm">
                  <Eye className="w-4 h-4" />
                  <span>{item.views} views</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h1>
              <ConditionBadge condition={item.condition} />
            </div>

            {/* Price */}
            <div className="py-4 border-y border-gray-200 dark:border-gray-700">
              <PriceDisplay price={item.price} isNegotiable={item.isNegotiable} size="large" />
            </div>

            {/* Description */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-gray-100">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">{item.description}</p>
              </CardContent>
            </Card>

            {/* Location */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg flex items-center dark:text-gray-100">
                  <MapPin className="w-5 h-5 mr-2 text-green-600 dark:text-green-400" />
                  Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <p className="text-gray-700 dark:text-gray-300">
                  {item.location?.address ?? 'Address not provided'}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  {item.location?.city
                    ? `${item.location.city}${item.location.state ? `, ${item.location.state}` : ''}${item.location.pincode ? ' ' + item.location.pincode : ''}`
                    : 'Location not specified'}
                </p>
              </CardContent>
            </Card>

            {/* Seller Info */}
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <CardTitle className="text-lg dark:text-gray-100">Seller Information</CardTitle>
              </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <strong className="mr-2">Name:</strong>
                    <span>
                      {typeof item.seller === 'string'
                        ? 'Seller'
                        : item.seller?.name ?? 'Seller not provided'}
                    </span>
                  </div>
                  {!isSoldOut && (
                    <div className="flex items-center text-gray-700 dark:text-gray-300">
                      <Phone className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                      <span>{item.sellerContact ?? 'Contact not provided'}</span>
                    </div>
                  )}
                </CardContent>
            </Card>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {!isOwnItem && (
                <>
                  <Button
                    onClick={handleBuyClick}
                    disabled={isSoldOut}
                    className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-lg py-6"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isSoldOut ? 'Sold Out' : 'Buy Now'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleFavorite}
                    className="p-6 dark:border-gray-600 dark:hover:bg-gray-800"
                  >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-400'}`} />
                  </Button>
                </>
              )}
              {isOwnItem && (
                <div className="flex-1 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-700 dark:text-blue-300 text-center font-medium">
                    This is your listing
                  </p>
                </div>
              )}
            </div>

            {/* Posted Date */}
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
              Posted on {new Date(item.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Buy Dialog */}
      <Dialog open={showBuyDialog} onOpenChange={setShowBuyDialog}>
        <DialogContent className="sm:max-w-md dark:bg-gray-800 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">Confirm Purchase</DialogTitle>
            <DialogDescription className="dark:text-gray-400">
              Please confirm your contact details. The seller will contact you to complete the transaction.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="buyerName" className="dark:text-gray-100">Your Name</Label>
              <Input
                id="buyerName"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                placeholder="Enter your name"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerContact" className="dark:text-gray-100">Contact (Phone/Email)</Label>
              <Input
                id="buyerContact"
                value={buyerContact}
                onChange={(e) => setBuyerContact(e.target.value)}
                placeholder="Enter your phone or email"
                className="dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              />
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-sm text-green-700 dark:text-green-300 font-medium mb-2">Item Details:</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <strong>{item.title}</strong>
              </p>
              <p className="text-lg font-bold text-green-700 dark:text-green-400 mt-1">
                ₹{typeof item.price === 'number' ? item.price.toLocaleString('en-IN') : 'N/A'}
              </p>
            </div>
          </div>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowBuyDialog(false)}
              disabled={isSubmitting}
              className="dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-700"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleBuySubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Confirm Purchase
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
