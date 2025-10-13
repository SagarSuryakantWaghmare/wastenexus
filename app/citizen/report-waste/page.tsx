"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Camera, MapPin, Loader2, Check, Sparkles, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function ReportWastePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<{
    wasteType: string;
    isRecyclable: boolean;
    materials: string[];
    additionalInfo?: string;
    quantity?: number;
    recyclability?: number;
  } | null>(null);
  const [formData, setFormData] = useState({
    address: '' // Initialize with empty string to prevent uncontrolled input warning
  });

  // Redirect if not authenticated
  if (authLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1]; // Remove the data URL prefix
        setPreviewUrl(reader.result as string);
        
        try {
          const { analyzeWasteImage } = await import('@/lib/services/gemini');
          const analysis = await analyzeWasteImage(base64Data);
          
          setAiAnalysis({
            wasteType: analysis.wasteType,
            isRecyclable: analysis.recyclability >= 50,
            materials: [analysis.wasteType],
            additionalInfo: analysis.description,
            quantity: analysis.quantity,
            recyclability: analysis.recyclability
          });
          
          toast.success('AI analysis complete!');
        } catch (error) {
          console.error('AI analysis failed:', error);
          toast.error('Failed to analyze image with AI');
        }
      };
      
      reader.readAsDataURL(file);
    }
  };

  const validateImage = () => {
    if (!imageFile) {
      toast.error("Please select an image");
      return false;
    }
    if (imageFile.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Image size should be less than 5MB");
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    try {
      // Get the current position
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      
      // Call Google Maps Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }
      
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        setFormData(prev => ({
          ...prev,
          address: address
        }));
        toast.success("Address found!");
      } else {
        throw new Error('No address found for this location');
      }
    } catch (error) {
      console.error('Error getting location:', error);
      toast.error("Failed to get address. Please enter it manually.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateImage()) return;
    
    if (!formData.address) {
      toast.error("Please enter an address");
      return;
    }

    if (!user?._id) {
      toast.error("User not authenticated. Please log in again.");
      router.push('/login');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Submitting report...');

    try {
      // Convert image to base64
      const imageBase64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1];
          resolve(base64Data);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile!);
      });

      // Send data to API
      const response = await fetch('/api/reports/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          address: formData.address,
          image: imageBase64,
          wasteType: aiAnalysis?.wasteType || 'general',
          isRecyclable: aiAnalysis?.isRecyclable || false,
          quantity: aiAnalysis?.quantity || 1,
          recyclability: aiAnalysis?.recyclability || 0
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create report');
      }
      
      toast.success(`🎉 Report submitted successfully! +${data.pointsEarned || 10} points earned`, { id: toastId });
      router.push('/citizen');
      
    } catch (error: any) {
      console.error('Submit error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit report';
      toast.error(errorMessage, { id: toastId });
      
      if (errorMessage.toLowerCase().includes('unauthorized') || 
          errorMessage.toLowerCase().includes('token')) {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Report Waste 🗑️</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-blue-600" />
                Upload Waste Photo
              </CardTitle>
              <CardDescription>Take a clear photo of the waste for documentation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-green-500 transition-colors">
                {previewUrl ? (
                  <div className="space-y-4 w-full">
                    <img src={previewUrl} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPreviewUrl(null);
                        setImageFile(null);
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
                        <p className="text-sm text-gray-500">PNG, JPG up to 5MB</p>
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
              <p className="text-sm text-gray-500 mt-2 text-center">
                Please ensure the waste is clearly visible in the photo
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                Location Details
              </CardTitle>
              <CardDescription>Where is this waste located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input
                  id="address"
                  placeholder="Enter waste location address"
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  required
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={getLocation}
                className="w-full"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Auto-detect Address
              </Button>
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  AI Waste Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="font-medium w-32">Waste Type:</span>
                    <span className="font-semibold">{aiAnalysis.wasteType}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium w-32">Recyclable:</span>
                    <span className={`font-semibold ${aiAnalysis.isRecyclable ? 'text-green-600' : 'text-amber-600'}`}>
                      {aiAnalysis.isRecyclable ? 'Yes ♻️' : 'No'}
                    </span>
                  </div>
                  <div className="flex items-start">
                    <span className="font-medium w-32">Materials:</span>
                    <div className="flex flex-wrap gap-2">
                      {aiAnalysis.materials.map((material, i) => (
                        <Badge key={i} variant="outline" className="bg-white">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {aiAnalysis.additionalInfo && (
                    <div className="pt-2 border-t border-green-100">
                      <p className="text-sm text-green-700">
                        <Info className="inline h-4 w-4 mr-1" />
                        {aiAnalysis.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>
                <Button 
                  onClick={() => {
                    toast.success('Report submitted successfully!');
                    router.push('/citizen');
                  }}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700"
                >
                  Done
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Submit */}
          {!aiAnalysis && (
            <Button
              type="submit"
              disabled={loading || !imageFile}
              className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Waste...
                </>
              ) : (
                "Submit Report & Earn Points"
              )}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
