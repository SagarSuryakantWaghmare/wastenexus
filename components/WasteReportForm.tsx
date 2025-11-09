"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LocationPicker } from '@/components/LocationPicker';
import { Upload, CheckCircle2, Camera, MapPin, Zap } from 'lucide-react';
import Image from 'next/image';
import { LoaderCircle } from '@/components/ui/loader';

interface WasteReportFormProps {
  onSuccess: () => void;
}

export function WasteReportForm({ onSuccess }: WasteReportFormProps) {
  const router = useRouter();
  const { token, refreshUser } = useAuth();
  const { apiCall } = useApi();

  const [type, setType] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [aiClassification, setAiClassification] = useState<{
    type: string;
    confidence: number;
    description: string;
    recyclable: boolean;
  } | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', points: '15 pts/kg' },
    { value: 'cardboard', label: 'Cardboard', points: '10 pts/kg' },
    { value: 'e-waste', label: 'E-Waste', points: '20 pts/kg' },
    { value: 'metal', label: 'Metal', points: '13 pts/kg' },
    { value: 'glass', label: 'Glass', points: '12 pts/kg' },
    { value: 'organic', label: 'Organic', points: '8 pts/kg' },
    { value: 'paper', label: 'Paper', points: '10 pts/kg' },
  ];

  const handleImageUpload = async () => {
    if (!imageFile) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
      setAiClassification(data.classification);

      if (data.classification.type) {
        setType(data.classification.type);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!type || !weightKg) {
      setError('Please fill in all required fields');
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await apiCall('/api/reports', {
        method: 'POST',
        body: JSON.stringify({
          type,
          weightKg: parseFloat(weightKg),
          imageUrl,
          aiClassification,
          location,
        }),
      });

      setType('');
      setWeightKg('');
      setImageFile(null);
      setImageUrl('');
      setAiClassification(null);
      setLocation(null);

      toast.success('🎉 Waste report submitted successfully!');
      
      // Refresh user data to update points
      await refreshUser();
      
      onSuccess();
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit report';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
      <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-800 border-b border-green-100 dark:border-gray-700 rounded-t-lg pb-6 transition-colors duration-300">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-600/10 dark:bg-green-600/20 rounded-lg">
            <Camera className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl text-green-700 dark:text-gray-100">Submit Waste Report</CardTitle>
        </div>
        <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
          Upload an image for AI-powered waste classification and track your impact
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Section 1: Upload & AI Classification Result */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">1</span>
              Waste Classification
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Upload Section */}
              <div className="flex flex-col gap-4">
                <div>
                  <Label className="text-gray-700 dark:text-gray-100 font-semibold mb-3 block">Waste Image (Optional)</Label>
                  <FileUpload
                    onChange={(files) => {
                      const file = files[0];
                      if (file) {
                        setImageFile(file);
                        setAiClassification(null);
                        setImageUrl('');
                      }
                    }}
                  />
                </div>
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={!imageFile || isUploading}
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold py-2.5 rounded-lg transition-all duration-200 w-full"
                >
                  {isUploading ? (
                    <>
                      <LoaderCircle size="sm" className="mr-2" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload & Classify
                    </>
                  )}
                </Button>
              </div>

              {/* Classification Result */}
              <div className="transition-all duration-300">
                {aiClassification ? (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-700 border-2 border-green-200 dark:border-gray-600 rounded-lg p-5 space-y-3 h-full flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold text-base">
                      <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                      Classification Complete
                    </div>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Type:</span>
                        <span className="text-green-700 dark:text-green-400 font-semibold">{aiClassification.type}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Confidence:</span>
                        <span className="text-green-700 dark:text-green-400 font-semibold">{(aiClassification.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <div className="border-t border-green-200 dark:border-gray-600 pt-2.5 mt-2.5">
                        <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">Description:</p>
                        <p className="text-gray-600 dark:text-gray-400">{aiClassification.description}</p>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-gray-700 dark:text-gray-300 font-medium">Recyclable:</span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${aiClassification.recyclable ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                          {aiClassification.recyclable ? 'Yes ♻️' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50 overflow-hidden relative p-8">
                    <Image
                      src="/gif/report.gif"
                      alt="Classification preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">2</span>
              Pickup Location
            </h3>
            <div className="flex flex-col gap-4">
              <LocationPicker
                onLocationSelect={setLocation}
                initialLocation={location || undefined}
              />
              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  {location?.address ? location.address : 'Select location on map to continue'}
                </span>
              </div>
              {/* Manual Address Input */}
              <div className="flex gap-2 items-center mt-2">
                <Button
                  type="button"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
                  onClick={async () => {
                    if (navigator.geolocation) {
                      navigator.geolocation.getCurrentPosition(async (pos) => {
                        const { latitude, longitude } = pos.coords;
                        let address = '';
                        try {
                          // Use a free reverse geocoding API (OpenStreetMap Nominatim)
                          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                          const data = await res.json();
                          address = data.display_name || '';
                        } catch {
                          address = '';
                        }
                        setLocation({ latitude, longitude, address });
                        toast.success('Location detected!');
                      }, () => {
                        toast.error('Unable to detect location');
                      });
                    } else {
                      toast.error('Geolocation not supported');
                    }
                  }}
                >
                  Auto Detect Location
                </Button>
                <Label htmlFor="manual-address" className="text-gray-700 dark:text-gray-100 font-semibold">Or enter address manually</Label>
              </div>
              <input
                id="manual-address"
                type="text"
                value={location?.address || ''}
                onChange={e => {
                  const address = e.target.value;
                  setLocation(prev => ({
                    latitude: prev?.latitude || 0,
                    longitude: prev?.longitude || 0,
                    address,
                  }));
                }}
                placeholder="Type address here..."
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
              />
            </div>
          </div>

          {/* Section 3: Waste Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">3</span>
              Waste Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Waste Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-gray-700 dark:text-gray-100 font-semibold">Waste Type *</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all h-auto text-base">
                    <SelectValue placeholder="Select waste type" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-lg border-gray-200 dark:border-gray-600 dark:bg-gray-700">
                    {wasteTypes.map((wt) => (
                      <SelectItem key={wt.value} value={wt.value} className="rounded flex items-center px-3 py-2 cursor-pointer dark:text-gray-100 dark:hover:bg-gray-600">
                        <div className="flex items-center justify-between gap-4">
                          <span className="font-medium">{wt.label}</span>
                          <span className="text-xs text-green-600 dark:text-green-400 font-semibold bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {wt.points}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <Label htmlFor="weight" className="text-gray-700 dark:text-gray-100 font-semibold">Weight (kg) *</Label>
                <input
                  id="weight"
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={weightKg}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeightKg(e.target.value)}
                  placeholder="Enter weight in kg"
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 shadow-sm px-4 py-2.5 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
                  required
                />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg font-medium">
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              {isSubmitting && <LoaderCircle size="sm" className="mr-2" />}
              {isSubmitting ? 'Submitting...' : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold rounded-lg transition-all duration-200"
              onClick={() => {
                setType('');
                setWeightKg('');
                setImageFile(null);
                setImageUrl('');
                setAiClassification(null);
                setLocation(null);
                setError('');
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}