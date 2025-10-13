"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, Filter, Heart } from "lucide-react";
import Link from "next/link";

export default function BrowseMarketplacePage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    loadItems();
  }, [category]);

  const loadItems = async () => {
    try {
      const url = category === "all" 
        ? '/api/marketplace?status=available'
        : `/api/marketplace?status=available&category=${category}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Failed to load items:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Browse Marketplace 🛒</h1>
            <p className="text-gray-600">Find items to reuse, exchange, or adopt</p>
          </div>
          <Button asChild>
            <Link href="/citizen/marketplace/list">List an Item</Link>
          </Button>
        </div>

        {/* Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="furniture">Furniture</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="clothes">Clothes</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="col-span-3 text-center text-gray-600">Loading items...</p>
          ) : items.length === 0 ? (
            <div className="col-span-3 text-center py-12">
              <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No items found</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item._id} className="hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  {item.images?.[0] ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-16 w-16 text-gray-400" />
                  )}
                </div>
                <CardContent className="pt-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{item.title}</h3>
                      <Badge variant="outline" className="mt-1">{item.category}</Badge>
                    </div>
                    <Badge className={
                      item.type === 'donate' ? 'bg-green-600' :
                      item.type === 'exchange' ? 'bg-blue-600' :
                      'bg-purple-600'
                    }>
                      {item.type}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Badge variant="secondary">{item.condition}</Badge>
                    {item.aiAnalysis?.estimatedValue && (
                      <span className="text-green-600 font-semibold">
                        {item.aiAnalysis.estimatedValue} pts
                      </span>
                    )}
                  </div>

                  <Button className="w-full" size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    I'm Interested
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
