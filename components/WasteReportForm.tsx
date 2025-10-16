
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
import { Upload, Loader2, CheckCircle2, Camera } from 'lucide-react';
import Image from 'next/image';

interface WasteReportFormProps {
  onSuccess: () => void;
}

export function WasteReportForm({ onSuccess }: WasteReportFormProps) {
  const router = useRouter();
  const { token } = useAuth();
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

      // Auto-fill waste type from AI
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

      // Reset form
      setType('');
      setWeightKg('');
      setImageFile(null);
      setImageUrl('');
      setAiClassification(null);
      setLocation(null);

      toast.success('Waste report submitted successfully!');
      onSuccess();
      // Redirect to home after short delay for toast
      setTimeout(() => {
        router.push('/');
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-green-200">
      <CardHeader>
        <CardTitle className="text-green-700">Submit Waste Report</CardTitle>
        <CardDescription>
          Upload an image for AI-powered waste classification
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Upload & Result */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Upload left, result right */}
            <div className="flex flex-col gap-3 justify-center min-h-[180px]">
              <Label>Waste Image (Optional)</Label>
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
              <Button
                type="button"
                onClick={handleImageUpload}
                disabled={!imageFile || isUploading}
                className="bg-green-600 hover:bg-green-700 mt-2 w-full"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
            <div className="flex flex-col justify-center min-h-[180px]">
              <div className="transition-all duration-300 h-full flex items-stretch">
                {aiClassification ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2 h-full flex flex-col justify-center w-full">
                    <div className="flex items-center gap-2 text-green-700 font-semibold">
                      <CheckCircle2 className="h-5 w-5" />
                      AI Classification Complete
                    </div>
                    <div className="text-sm space-y-1">
                      <p><strong>Type:</strong> {aiClassification.type}</p>
                      <p><strong>Confidence:</strong> {(aiClassification.confidence * 100).toFixed(0)}%</p>
                      <p><strong>Description:</strong> {aiClassification.description}</p>
                      <p><strong>Recyclable:</strong> {aiClassification.recyclable ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full w-full border border-dashed border-green-200 rounded-lg bg-green-50 overflow-hidden relative my-2">
                    <Image
                      src="/gif/report.gif"
                      alt="Result preview background"
                      fill
                      className="object-cover rounded-2xl"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Section 2: Map/Location */}
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <div className="w-full max-w-full">
              <LocationPicker
                onLocationSelect={setLocation}
                initialLocation={location || undefined}
              />
            </div>
            <div className="w-full mt-2 text-center">
              <span className="block text-gray-700 font-semibold">
                {location?.address ? location.address : '[Select location on map]'}
              </span>
            </div>
          </div>

          {/* Section 3: Information fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <Label htmlFor="type">Waste Type *</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="border-green-200 bg-white shadow-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 transition-all">
                  <SelectValue placeholder="Select waste type" />
                </SelectTrigger>
                <SelectContent className="rounded-lg shadow-lg border-green-100">
                  {wasteTypes.map((wt) => (
                    <SelectItem key={wt.value} value={wt.value} className="rounded flex items-center px-3 py-2 hover:bg-green-50 focus:bg-green-100">
                      <div className="flex justify-between items-center w-full">
                        <span>{wt.label}</span>
                        <span className="text-xs text-green-600 ml-2">{wt.points}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <input
                id="weight"
                type="number"
                step="0.1"
                min="0.1"
                value={weightKg}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWeightKg(e.target.value)}
                placeholder="Enter weight in kg"
                className="border-green-200 bg-white shadow-sm px-4 py-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-200 transition-all text-base"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Camera className="h-4 w-4 mr-2" />
                  Submit Report
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full sm:w-auto px-8 py-3 border-green-200 text-green-700 hover:bg-green-50"
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