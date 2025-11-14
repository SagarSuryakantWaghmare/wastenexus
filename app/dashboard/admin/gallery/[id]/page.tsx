"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Images, ArrowLeft } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import Image from 'next/image';
import { FileUpload } from '@/components/ui/file-upload';

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

export default function EditGalleryPage() {
  const router = useRouter();
  const params = useParams();
  const { token } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && params.id) {
      fetchGalleryItem();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, params.id]);

  // Clean up blob URLs created for previews
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        try {
          URL.revokeObjectURL(imagePreview);
        } catch {
          // ignore
        }
      }
    };
  }, [imagePreview]);

  const fetchGalleryItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/gallery/${params.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        const item = data.data;
        setFormData({
          name: item.name,
          title: item.title,
          location: item.location,
          date: new Date(item.date).toISOString().split('T')[0],
          description: item.description,
          image: item.image,
          isActive: item.isActive,
          order: item.order,
        });
        setImagePreview(item.image || null);
        setImageFile(null);
      } else {
        setError('Failed to load gallery item');
        setTimeout(() => router.push('/dashboard/admin/gallery'), 2000);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
      setError('Failed to load gallery item');
      setTimeout(() => router.push('/dashboard/admin/gallery'), 2000);
    } finally {
      setLoading(false);
    }
  };

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

    if (!formData.image.trim() && !imageFile && !removeImage) {
      errors.image = 'Image is required — upload a file or keep existing image';
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

    try {
      setSubmitting(true);
      setError(null);

      const fd = new FormData();
      fd.append('name', formData.name);
      fd.append('title', formData.title);
      fd.append('location', formData.location);
      fd.append('date', formData.date);
      fd.append('description', formData.description);
      fd.append('isActive', String(formData.isActive));
      fd.append('order', String(formData.order ?? 0));
      // Append image file if selected; otherwise include existing image URL if present
      if (imageFile) {
        fd.append('image', imageFile);
      } else if (formData.image) {
        fd.append('image', formData.image);
      }
      if (removeImage) fd.append('removeImage', 'true');

      const response = await fetch(`/api/admin/gallery/${params.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          // NOTE: Do not set Content-Type for FormData; the browser will set the boundary
        },
        body: fd,
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/dashboard/admin/gallery');
      } else {
        setError(data.error || 'Failed to update gallery item');
      }
    } catch (err) {
      console.error('Error updating gallery:', err);
      setError('Failed to update gallery item');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <LoaderCircle size="xl" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 font-medium">Loading gallery item...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
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
              Edit Gallery Item
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            Update the gallery showcase item details
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="ml-4 underline">Dismiss</button>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
            <CardHeader className="border-b border-gray-200 dark:border-gray-700">
              <CardTitle className="text-gray-900 dark:text-white">Gallery Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Update the information for this gallery item
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">
                  Event Name <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                    ({formData.name.length}/100 characters)
                  </span>
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Tree Plantation Drive"
                  maxLength={100}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {formErrors.name && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.name}</p>}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-900 dark:text-gray-100">
                  Short Title <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                    ({formData.title.length}/60 characters)
                  </span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Student Plantation"
                  maxLength={60}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                {formErrors.title && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.title}</p>}
              </div>

              {/* Location & Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-gray-900 dark:text-gray-100">
                    Location <span className="text-red-500">*</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                      ({formData.location.length}/150)
                    </span>
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Chhatrapati Sambhaji Nagar"
                    maxLength={150}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  {formErrors.location && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.location}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date" className="text-gray-900 dark:text-gray-100">
                    Event Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  {formErrors.date && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.date}</p>}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                  Description <span className="text-red-500">*</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2 font-normal">
                    ({formData.description.length}/300 characters)
                  </span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the event or initiative in detail..."
                  rows={5}
                  maxLength={300}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 resize-none"
                />
                {formErrors.description && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.description}</p>}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image" className="text-gray-900 dark:text-gray-100">
                  Image <span className="text-red-500">*</span>
                </Label>
                <FileUpload
                  onChange={(files) => {
                    const file = files && files.length ? files[0] : null;
                    if (file) {
                      // revoke previous blob URL if present
                      if (imagePreview && imagePreview.startsWith('blob:')) {
                        URL.revokeObjectURL(imagePreview);
                      }
                      setImageFile(file);
                      setImagePreview(URL.createObjectURL(file));
                      setRemoveImage(false);
                    }
                  }}
                />
                {formErrors.image && <p className="text-xs text-red-500 dark:text-red-400">{formErrors.image}</p>}

                <div className="flex items-start gap-4 mt-4">
                  {(imagePreview || formData.image) && (
                    <div className="relative w-full aspect-[16/9] md:aspect-[4/3] bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                      <Image
                        src={imagePreview || formData.image || ''}
                        alt="Preview"
                        fill
                        className="object-cover"
                        onError={() => setFormErrors({ ...formErrors, image: 'Invalid image - please check the path or upload a new file' })}
                      />
                    </div>
                  )}

                  <div className="flex flex-col items-start gap-2">
                    {imageFile && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          if (imagePreview && imagePreview.startsWith('blob:')) {
                            URL.revokeObjectURL(imagePreview);
                          }
                          setImageFile(null);
                          setImagePreview(formData.image || null);
                        }}
                        className="w-full"
                      >
                        Remove selected file
                      </Button>
                    )}

                    <label className="flex items-center space-x-2 mt-2">
                      <input
                        id="removeImage"
                        type="checkbox"
                        checked={removeImage}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setRemoveImage(val);
                          if (val) {
                            // clear preview and selected file
                            if (imagePreview && imagePreview.startsWith('blob:')) {
                              URL.revokeObjectURL(imagePreview);
                            }
                            setImageFile(null);
                            setImagePreview(null);
                            // also clear formData.image so validation knows it's removed
                            setFormData({ ...formData, image: '' });
                          } else {
                            // restore preview from existing image field
                            setImagePreview(formData.image || null);
                          }
                        }}
                        className="w-4 h-4 text-indigo-600 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">Remove existing image</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Display Order & Active Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="order" className="text-gray-900 dark:text-gray-100">
                    Display Order
                  </Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400">Lower numbers appear first</p>
                </div>

                <div className="flex items-center space-x-3 pt-8">
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
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/admin/gallery')}
              disabled={submitting}
              className="w-full sm:w-auto bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
            >
              {submitting ? (
                <>
                  <LoaderCircle size="sm" />
                  <span className="ml-2">Updating...</span>
                </>
              ) : (
                <>
                  <Images className="w-4 h-4 mr-2" />
                  Update Gallery Item
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
