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
    <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-colors">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-gray-900 dark:text-gray-100">Filters</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onReset}
            className="text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category */}
        <div>
          <Label className="mb-2 block text-gray-700 dark:text-gray-300">Category</Label>
          <Select value={filters.category} onValueChange={(value) => updateFilter('category', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category === 'All Categories' ? 'all' : category}
                  className="data-[state=active]:bg-input/30 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition */}
        <div>
          <Label className="mb-2 block text-gray-700 dark:text-gray-300">Condition</Label>
          <Select value={filters.condition} onValueChange={(value) => updateFilter('condition', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {CONDITIONS.map((condition) => (
                <SelectItem
                  key={condition}
                  value={condition === 'All Conditions' ? 'all' : condition}
                  className="data-[state=active]:bg-input/30 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
                >
                  {condition}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div>
          <Label className="mb-2 block text-gray-700 dark:text-gray-300">
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
          <Label htmlFor="city" className="mb-2 block text-gray-700 dark:text-gray-300">City</Label>
          <Input
            id="city"
            type="text"
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            placeholder="Enter city name"
            className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Sort */}
        <div>
          <Label className="mb-2 block text-gray-700 dark:text-gray-300">Sort By</Label>
          <Select value={filters.sort} onValueChange={(value) => updateFilter('sort', value)}>
            <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
              {SORT_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className="data-[state=active]:bg-input/30 dark:data-[state=active]:bg-gray-700 data-[state=active]:text-gray-900 dark:data-[state=active]:text-gray-100"
                >
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
