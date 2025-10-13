"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Camera, Loader2, Sparkles, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ListItemPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    type: "",
    address: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeItem = async () => {
    if (!imageFile || !formData.title) {
      toast.error("Please add image and title first");
      return;
    }

    setLoading(true);
    try {
      // Simulate AI analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis = {
        reuseability: "This item is in good condition and can be easily reused. Perfect for donation or exchange.",
        suggestions: [
          "Donate to local charity organizations",
          "Exchange with community members for eco-points",
          "Repurpose for creative DIY projects",
          "Offer to schools or educational institutions"
        ],
        estimatedValue: 250
      };
      
      setAiAnalysis(mockAnalysis);
      toast.success("✨ AI analysis complete!");
    } catch (error) {
      toast.error("Failed to analyze item");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!imageFile) {
      toast.error("Please upload an image");
      return;
    }

    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const formDataToSend = new FormData();
      formDataToSend.append('userId', user._id);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('address', formData.address);
      formDataToSend.append('image', imageFile);

      const response = await fetch('/api/marketplace', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to create listing');
      }

      toast.success("🎉 Item listed successfully!");
      router.push('/citizen/marketplace/browse');
    } catch (error) {
      console.error('Submit error:', error);
      toast.error("Failed to list item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">List an Item 📦</h1>
          <p className="text-gray-600">Get AI-powered reuse suggestions for your items</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-orange-600" />
                Upload Item Photo
              </CardTitle>
              <CardDescription>AI will analyze and suggest reuse options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-orange-500 transition-colors">
                {imagePreview ? (
                  <div className="space-y-4 w-full">
                    <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setImagePreview(null);
                        setImageFile(null);
                        setAiAnalysis(null);
                      }}
                      className="w-full"
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <>
                    <Camera className="h-16 w-16 text-gray-400 mb-4" />
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <div className="text-center">
                        <p className="text-lg font-semibold text-gray-700">Click to upload</p>
                        <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </Label>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Item Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Wooden Chair, Old Laptop, Books"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the item's condition, usage, etc."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="furniture">Furniture</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="books">Books</SelectItem>
                      <SelectItem value="clothes">Clothes</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select value={formData.condition} onValueChange={(value) => setFormData({ ...formData, condition: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="like_new">Like New</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="needs_repair">Needs Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type *</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donate">Donate (Free)</SelectItem>
                    <SelectItem value="exchange">Exchange (For Points)</SelectItem>
                    <SelectItem value="sell">Sell (For Points)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Pickup Location *</Label>
                <Input
                  id="address"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <Button
                type="button"
                onClick={analyzeItem}
                disabled={loading || !imageFile || !formData.title}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Get AI Suggestions
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* AI Suggestions */}
          {aiAnalysis && (
            <Card className="border-2 border-orange-300">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-orange-600" />
                  AI Reuse Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Reuseability Assessment:</p>
                  <p className="text-gray-600">{aiAnalysis.reuseability}</p>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <p className="text-sm font-semibold text-gray-700 mb-3">Suggested Actions:</p>
                  <ul className="space-y-2">
                    {aiAnalysis.suggestions.map((suggestion: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2 text-gray-600">
                        <span className="text-green-600 mt-1">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border-2 border-green-300">
                  <p className="text-sm text-gray-600 mb-1">Estimated Value</p>
                  <p className="text-3xl font-bold text-green-600">{aiAnalysis.estimatedValue} points 🌿</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          <Button
            type="submit"
            disabled={loading || !imageFile}
            className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Listing Item...
              </>
            ) : (
              "List Item"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
