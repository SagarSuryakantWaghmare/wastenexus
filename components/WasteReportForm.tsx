'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useApi } from '@/hooks/useApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  const { token } = useAuth();
  const { apiCall } = useApi();
  
  const [type, setType] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setAiClassification(null);
      setImageUrl('');
    }
  };

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
      setImagePreview('');
      setImageUrl('');
      setAiClassification(null);
      setLocation(null);
      
      onSuccess();
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
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-3">
            <Label>Waste Image (Optional)</Label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
              </div>
              {imageFile && !imageUrl && (
                <Button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="bg-green-600 hover:bg-green-700"
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
              )}
            </div>

            {/* Image Preview */}
            {imagePreview && (
              <div className="relative w-full h-48 rounded-lg overflow-hidden border-2 border-green-200">
                <Image
                  src={imagePreview}
                  alt="Waste preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* AI Classification Result */}
            {aiClassification && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-2">
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
            )}
          </div>

          {/* Waste Type */}
          <div className="space-y-2">
            <Label htmlFor="type">Waste Type *</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="border-green-200">
                <SelectValue placeholder="Select waste type" />
              </SelectTrigger>
              <SelectContent>
                {wasteTypes.map((wt) => (
                  <SelectItem key={wt.value} value={wt.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{wt.label}</span>
                      <span className="text-xs text-green-600 ml-2">{wt.points}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Weight */}
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              min="0.1"
              value={weightKg}
              onChange={(e) => setWeightKg(e.target.value)}
              placeholder="Enter weight in kg"
              className="border-green-200"
              required
            />
          </div>

          {/* Location Picker */}
          <LocationPicker
            onLocationSelect={setLocation}
            initialLocation={location || undefined}
          />

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-green-600 hover:bg-green-700"
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
        </form>
      </CardContent>
    </Card>
  );
}
