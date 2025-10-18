'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ConditionBadge from './ConditionBadge';
import PriceDisplay from './PriceDisplay';

interface ItemCardProps {
  item: {
    _id: string;
    title: string;
    price: number;
    images: string[];
    condition: 'Like New' | 'Good' | 'Fair' | 'Needs Repair';
    location: {
      city: string;
      state: string;
    };
    category: string;
    isNegotiable: boolean;
    views?: number;
    favorites?: string[];
    status?: string;
    createdAt: string;
  };
  onFavorite?: (itemId: string) => void;
  isFavorited?: boolean;
  showStatus?: boolean;
}

export default function ItemCard({ item, onFavorite, isFavorited, showStatus }: ItemCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onFavorite) {
      onFavorite(item._id);
    }
  };

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    approved: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    rejected: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    sold: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  // Safe fallbacks to avoid runtime errors when backend omits optional data
  const imageSrc = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '/placeholder-image.jpg';
  const locationText = item.location?.city ? `${item.location.city}, ${item.location.state ?? ''}` : 'Location not provided';

  return (
    <Link href={`/marketplace/${item._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-100 dark:bg-gray-800">
          <Image
            src={imageSrc}
            alt={item.title}
            fill
            className="object-cover"
          />
          
          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <Heart
                className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </button>
          )}

          {/* Status Badge (for seller view) */}
          {showStatus && item.status && (
            <Badge className={`absolute top-2 left-2 ${statusColors[item.status as keyof typeof statusColors]}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          )}

          {/* Category Badge */}
          <Badge className="absolute bottom-2 left-2 bg-gray-900/70 text-white">
            {item.category}
          </Badge>
        </div>

        <CardContent className="p-4 flex-1">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-gray-900 dark:text-gray-100">{item.title}</h3>

          {/* Condition */}
          <div className="mb-3">
            <ConditionBadge condition={item.condition} />
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{locationText}</span>
          </div>

          {/* Views */}
          {item.views !== undefined && (
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
              <Eye className="w-4 h-4 mr-1" />
              <span>{item.views} views</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-4 pt-0">
          <PriceDisplay price={item.price} isNegotiable={item.isNegotiable} />
        </CardFooter>
      </Card>
    </Link>
  );
}
