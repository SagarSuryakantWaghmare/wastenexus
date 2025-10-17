'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

export interface FilterValues {
  category: string;
  condition: string;
  minPrice: number;
  maxPrice: number;
  city: string;
  sort: string;
}

interface ItemFiltersProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onReset: () => void;
}

const CATEGORIES = [
  'All Categories',
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Toys',
  'Appliances',
  'Sports',
  'Home Decor',
  'Kitchen',
  'Other',
];

const CONDITIONS = ['All Conditions', 'Like New', 'Good', 'Fair', 'Needs Repair'];

const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: 'createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: '-views', label: 'Most Viewed' },
];

export default function ItemFilters({ filters, onFilterChange, onReset }: ItemFiltersProps) {
  const updateFilter = (key: keyof FilterValues, value: string | number) => {
    onFilterChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceChange = (values: number[]) => {
    onFilterChange({
      ...filters,
      minPrice: values[0],
      maxPrice: values[1],
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={onReset}>
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category */}
        <div>
          <Label className="mb-2 block">Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category === 'All Categories' ? 'all' : category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div>
          <Label className="mb-2 block">Condition</Label>
          <Select value={filters.condition} onValueChange={(value) => updateFilter('condition', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CONDITIONS.map((condition) => (
                <SelectItem key={condition} value={condition === 'All Conditions' ? 'all' : condition}>
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-2 block">
            Price Range: ₹{filters.minPrice.toLocaleString()} - ₹{filters.maxPrice.toLocaleString()}
          </Label>
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={[filters.minPrice, filters.maxPrice]}
            onValueChange={handlePriceChange}
            className="mt-2"
          />
        </div>

        {/* City */}
        <div>
          <Label htmlFor="city" className="mb-2 block">City</Label>
          <Input
            id="city"
            type="text"
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            placeholder="Enter city name"
          />
        </div>

        {/* Sort */}
        <div>
          <Label className="mb-2 block">Sort By</Label>
          <Select value={filters.sort} onValueChange={(value) => updateFilter('sort', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
