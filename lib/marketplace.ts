export type NormalizedMarketplaceItem = {
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
    coordinates?: { lat: number; lng: number } | undefined;
  };
  seller: {
    _id: string;
    name: string;
    email: string;
  };
  sellerName: string;
  sellerContact: string;
  isNegotiable: boolean;
  views: number;
  favorites: string[];
  status: string;
  createdAt: string;
  tags: string[];
  // optional buyer info
  buyer?: string;
  buyerName?: string;
  buyerContact?: string;
};

const VALID_CONDITIONS = ['Like New', 'Good', 'Fair', 'Needs Repair'];

export function normalizeMarketplaceItem(raw: unknown): NormalizedMarketplaceItem {
  const item = (raw ?? {}) as Record<string, unknown>;

  const asString = (v: unknown): string | undefined => (typeof v === 'string' ? v : undefined);
  const asNumber = (v: unknown): number | undefined =>
    typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : undefined;

  const _id = asString(item['_id']) ?? asString(item['id']) ?? '';
  const title = asString(item['title']) ?? 'Untitled Item';
  const description = asString(item['description']) ?? '';

  // Price: prefer number, try parsing strings, fallback to 0
  let price = 0;
  const priceRaw = item['price'];
  const priceNum = asNumber(priceRaw);
  price = Number.isFinite(priceNum ?? NaN) ? (priceNum as number) : 0;

  const imagesRaw = item['images'];
  const images = Array.isArray(imagesRaw) ? (imagesRaw.filter((x) => typeof x === 'string') as string[]) : [];

  const conditionRaw = asString(item['condition']);
  const condition = VALID_CONDITIONS.includes(conditionRaw ?? '') ? (conditionRaw as 'Like New' | 'Good' | 'Fair' | 'Needs Repair') : 'Fair';
  const category = asString(item['category']) ?? 'Other';

  const locationRaw = item['location'] as Record<string, unknown> | undefined;
  const location = {
    address: asString(locationRaw?.['address']) ?? '',
    city: asString(locationRaw?.['city']) ?? '',
    state: asString(locationRaw?.['state']) ?? '',
    pincode: asString(locationRaw?.['pincode']) ?? '',
    coordinates: (locationRaw?.['coordinates'] as { lat: number; lng: number } | undefined) ?? undefined,
  };

  // Seller: may be populated object or id; prefer sellerName field if present
  const sellerRaw = item['seller'];
  let sellerId = '';
  let sellerNameFromObj: string | undefined;
  let sellerEmail = '';
  if (typeof sellerRaw === 'string') {
    sellerId = sellerRaw;
  } else if (typeof sellerRaw === 'object' && sellerRaw !== null) {
    const sellerRec = sellerRaw as Record<string, unknown>;
    sellerId = asString(sellerRec['_id']) ?? '';
    sellerNameFromObj = asString(sellerRec['name']) ?? undefined;
  sellerEmail = asString(sellerRec['email']) ?? '';
  }
  const sellerName = asString(item['sellerName']) ?? sellerNameFromObj ?? 'Seller not provided';
  const sellerContact = asString(item['sellerContact']) ?? '';

  const isNegotiable = typeof item['isNegotiable'] === 'boolean' ? (item['isNegotiable'] as boolean) : true;
  const views = Number.isFinite(Number(item['views'])) ? Number(item['views']) : 0;

  const favoritesRaw = Array.isArray(item.favorites) ? (item.favorites as unknown[]) : [];
  const favorites = favoritesRaw
    .map((f: unknown) => {
      if (typeof f === 'string') return f;
      if (typeof f === 'object' && f !== null && '_id' in (f as Record<string, unknown>)) {
        const id = (f as Record<string, unknown>)['_id'];
        return typeof id === 'string' ? id : String(id ?? '');
      }
      return '';
    })
    .filter(Boolean) as string[];

  const status = asString(item['status']) ?? 'pending';
  const createdAt = asString(item['createdAt']) ?? new Date().toISOString();
  const tags = Array.isArray(item['tags']) ? (item['tags'].filter((t) => typeof t === 'string') as string[]) : [];

  return {
    _id: _id as string,
    title: title as string,
    description: description as string,
    price: price as number,
    images: images as string[],
    condition: condition as 'Like New' | 'Good' | 'Fair' | 'Needs Repair',
    category: category as string,
    location: location as { address: string; city: string; state: string; pincode?: string; coordinates?: { lat: number; lng: number } | undefined },
    seller: { _id: sellerId ?? '', name: sellerName, email: sellerEmail },
    sellerName: sellerName as string,
    sellerContact: sellerContact as string,
    isNegotiable: isNegotiable as boolean,
    views: views as number,
    favorites: favorites as string[],
    status: status as string,
    createdAt: createdAt as string,
    tags: tags as string[],
    buyer:
      typeof item['buyer'] === 'string'
        ? (item['buyer'] as string)
        : typeof item['buyer'] === 'object' && item['buyer'] !== null && '_id' in (item['buyer'] as Record<string, unknown>)
        ? String((item['buyer'] as Record<string, unknown>)['_id'])
        : undefined,
    buyerName: asString(item['buyerName']) ?? undefined,
    buyerContact: asString(item['buyerContact']) ?? undefined,
  };
}

export function normalizeMarketplaceList(items: unknown[]): NormalizedMarketplaceItem[] {
  return Array.isArray(items) ? (items as unknown[]).map(normalizeMarketplaceItem) : [];
}
