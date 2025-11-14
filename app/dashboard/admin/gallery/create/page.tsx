"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from '@/components/ui/file-upload';
import { Images, ArrowLeft, Calendar } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import { toast } from 'sonner';

interface FormData {
  name: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
  isActive: boolean;
  order: number;
}

const initialFormData: FormData = {
  name: '',
  title: '',
  location: '',
  date: new Date().toISOString().split('T')[0],
  description: '',
  image: '',
  isActive: true,
  order: 0,
};

export default function CreateGalleryPage() {
  const router = useRouter();
  const { token } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 3) {
      errors.name = 'Name must be at least 3 characters';
    } else if (formData.name.trim().length > 100) {
      errors.name = 'Name must not exceed 100 characters';
    }

    if (!formData.title.trim() || formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 60) {
      errors.title = 'Title must not exceed 60 characters';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    } else if (formData.location.trim().length > 150) {
      errors.location = 'Location must not exceed 150 characters';
    }

    if (!formData.description.trim() || formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 300) {
      errors.description = 'Description must not exceed 300 characters';
    }

    if (!imageFile) {
      errors.image = 'Image is required';
    }

    if (!formData.date) {
      errors.date = 'Date is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    if (!imageFile) {
      toast.error('Please upload an image');
      return;
    }

    setSubmitting(true);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('title', formData.title);
      form.append('location', formData.location);
      form.append('date', formData.date);
      form.append('description', formData.description);
      form.append('image', imageFile);
      form.append('isActive', formData.isActive.toString());
      form.append('order', formData.order.toString());

      const response = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Gallery item created successfully!');
        router.push('/dashboard/admin/gallery');
      } else {
        toast.error(data.error || 'Failed to create gallery item');
      }
    } catch (err) {
      console.error('Error creating gallery:', err);
      toast.error('Failed to create gallery item');
    } finally {
      setSubmitting(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/admin/gallery')}
            className="inline-flex items-center gap-2 w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Button>
        </div>

        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-full">
              <Images className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              Create Gallery Item
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Add a new showcase item to the homepage gallery
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardHeader className="bg-indigo-50 dark:bg-indigo-900/20 border-b-2 border-gray-200 dark:border-gray-700 rounded-t-lg pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
                  <Images className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">Gallery Details</CardTitle>
              </div>
              <CardDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Fill in the information for the new gallery showcase item
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8">
              <div className="space-y-6 sm:space-y-8">
                
                {/* Section 1: Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">1</span>
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Event Name * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({formData.name.length}/100 characters)</span>
                      </Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g., Tree Plantation Drive"
                        maxLength={100}
                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                      {formErrors.name && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.name}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Short Title * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({formData.title.length}/60 characters)</span>
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="e.g., Student Plantation"
                        maxLength={60}
                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                      {formErrors.title && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.title}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Description * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({formData.description.length}/300 characters)</span>
                      </Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe the event or initiative in detail..."
                        rows={5}
                        maxLength={300}
                        className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-transparent resize-none text-sm sm:text-base"
                        required
                      />
                      {formErrors.description && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.description}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 2: Location & Date */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">2</span>
                    Location & Date
                  </h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="location" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Location * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">({formData.location.length}/150)</span>
                      </Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        placeholder="e.g., Chhatrapati Sambhaji Nagar"
                        maxLength={150}
                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                      {formErrors.location && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.location}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        Event Date *
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                        required
                      />
                      {formErrors.date && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.date}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 3: Gallery Image */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">3</span>
                    Gallery Image
                  </h3>
                  <div className="space-y-3">
                    <Label htmlFor="eventImage" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">Event Image *</Label>
                    <FileUpload onChange={(files) => setImageFile(files[0] || null)} />
                    {imageFile && (
                      <div className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-700 rounded-lg">
                        <span className="text-indigo-700 dark:text-indigo-400 font-semibold text-sm">✓ Selected:</span>
                        <span className="text-indigo-600 dark:text-indigo-400 text-sm truncate">{imageFile.name}</span>
                      </div>
                    )}
                    {formErrors.image && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.image}</p>}
                  </div>
                </div>

                {/* Section 4: Display Settings */}
                <div className="space-y-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-bold">4</span>
                    Display Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="order" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Display Order
                      </Label>
                      <Input
                        id="order"
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400">Lower numbers appear first</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                        Visibility
                      </Label>
                      <div className="flex items-center space-x-3 pt-2">
                        <input
                          type="checkbox"
                          id="isActive"
                          checked={formData.isActive}
                          onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                          className="w-5 h-5 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-indigo-500 dark:focus:ring-indigo-400"
                        />
                        <Label htmlFor="isActive" className="cursor-pointer text-gray-900 dark:text-gray-100 font-medium">
                          Active on homepage
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData(initialFormData);
                      setImageFile(null);
                      setFormErrors({});
                    }}
                    className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 rounded-lg transition-all text-sm sm:text-base"
                  >
                    Clear Form
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    {submitting ? (
                      <>
                        <LoaderCircle size="sm" className="inline-block" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Images className="h-4 w-4" />
                        Create Gallery Item
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}
