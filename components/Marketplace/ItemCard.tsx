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
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    sold: 'bg-gray-100 text-gray-800',
  };

  return (
    <Link href={`/marketplace/${item._id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 w-full bg-gray-100">
          <Image
            src={item.images[0] || '/placeholder-image.jpg'}
            alt={item.title}
            fill
            className="object-cover"
          />
          
          {/* Favorite Button */}
          {onFavorite && (
            <button
              onClick={handleFavoriteClick}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
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
          <Badge className="absolute bottom-2 left-2 bg-black/70 text-white">
            {item.category}
          </Badge>
        </div>

        <CardContent className="p-4 flex-1">
          {/* Title */}
          <h3 className="font-semibold text-lg line-clamp-2 mb-2">{item.title}</h3>

          {/* Condition */}
          <div className="mb-3">
            <ConditionBadge condition={item.condition} />
          </div>

          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-3">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{item.location.city}, {item.location.state}</span>
          </div>

          {/* Views */}
          {item.views !== undefined && (
            <div className="flex items-center text-gray-500 text-sm">
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
