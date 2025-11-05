import ItemCard from './ItemCard';

interface ItemGridProps {
  items: Array<{
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
  }>;
  onFavorite?: (itemId: string) => void;
  favoritedItems?: string[];
  showStatus?: boolean;
  emptyMessage?: string;
}

export default function ItemGrid({ 
  items, 
  onFavorite,
  favoritedItems = [],
  showStatus = false,
  emptyMessage = 'No items found'
}: ItemGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16">
        <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={item}
          onFavorite={onFavorite}
          isFavorited={favoritedItems.includes(item._id)}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
}
