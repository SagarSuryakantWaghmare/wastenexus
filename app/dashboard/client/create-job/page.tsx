'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Navbar } from '@/components/Navbar';
import { BackButton } from '@/components/ui/back-button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase, Home, Building2, Package, MapPin, AlertCircle } from 'lucide-react';
import { LoaderOne } from '@/components/ui/loader';
import { toast } from 'sonner';

export default function CreateJobPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'home' as 'industry' | 'home' | 'other',
    address: '',
    wasteTypes: [] as string[],
    estimatedWeight: '',
    budget: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    scheduledDate: '',
    contactName: user?.name || '',
    contactPhone: '',
    contactEmail: user?.email || '',
  });

  const wasteTypeOptions = ['plastic', 'cardboard', 'e-waste', 'metal', 'glass', 'organic', 'paper'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.title || !formData.description || !formData.address || formData.wasteTypes.length === 0) {
        setError('Please fill in all required fields');
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Authentication required');
        toast.error('Authentication required');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          category: formData.category,
          location: {
            address: formData.address,
          },
          wasteType: formData.wasteTypes,
          estimatedWeight: formData.estimatedWeight ? parseFloat(formData.estimatedWeight) : undefined,
          budget: formData.budget ? parseFloat(formData.budget) : undefined,
          urgency: formData.urgency,
          scheduledDate: formData.scheduledDate || undefined,
          clientContact: {
            name: formData.contactName,
            phone: formData.contactPhone,
            email: formData.contactEmail,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create job');
      }

      setSuccess(true);
      toast.success('Job created successfully!');
      setTimeout(() => {
        router.push('/dashboard/client');
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const toggleWasteType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(type)
        ? prev.wasteTypes.filter((t) => t !== type)
        : [...prev.wasteTypes, type],
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
        <LoaderOne />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <BackButton href="/dashboard/client" label="Back to Dashboard" />
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Briefcase className="w-10 h-10 text-green-600 dark:text-green-400" />
            Post a Job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Create a waste collection job for workers to complete
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-green-800 dark:text-green-300 font-medium">
              Job posted successfully! Redirecting to dashboard...
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Card className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Job Details</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Provide information about the waste collection job. All jobs require admin verification before becoming visible to workers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-gray-900 dark:text-gray-100">
                  Job Title <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Large Cardboard Collection Needed"
                  maxLength={100}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-gray-900 dark:text-gray-100">
                  Description <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide details about the waste, quantity, access instructions, etc."
                  rows={4}
                  maxLength={1000}
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formData.description.length}/1000 characters
                </p>
              </div>

              {/* Category */}
              <div>
                <Label className="text-gray-900 dark:text-gray-100">
                  Category <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'home' })}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.category === 'home'
                        ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                    }`}
                  >
                    <Home className={`w-8 h-8 ${formData.category === 'home' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-medium ${formData.category === 'home' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      Home
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'industry' })}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.category === 'industry'
                        ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                    }`}
                  >
                    <Building2 className={`w-8 h-8 ${formData.category === 'industry' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-medium ${formData.category === 'industry' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      Industry
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: 'other' })}
                    className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                      formData.category === 'other'
                        ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30'
                        : 'border-gray-200 dark:border-gray-600 hover:border-green-300 dark:hover:border-green-500'
                    }`}
                  >
                    <Package className={`w-8 h-8 ${formData.category === 'other' ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`} />
                    <span className={`font-medium ${formData.category === 'other' ? 'text-green-700 dark:text-green-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      Other
                    </span>
                  </button>
                </div>
              </div>

              {/* Location */}
              <div>
                <Label htmlFor="address" className="text-gray-900 dark:text-gray-100">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  Pickup Address <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full address including landmark"
                  required
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
              </div>

              {/* Waste Types */}
              <div>
                <Label className="text-gray-900 dark:text-gray-100">
                  Waste Types <span className="text-red-500 dark:text-red-400">*</span>
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                  {wasteTypeOptions.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => toggleWasteType(type)}
                      className={`px-4 py-2 border-2 rounded-lg capitalize font-medium transition-all ${
                        formData.wasteTypes.includes(type)
                          ? 'border-green-600 dark:border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-green-300 dark:hover:border-green-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Estimated Weight & Budget */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight" className="text-gray-900 dark:text-gray-100">Estimated Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                    placeholder="e.g., 50"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <Label htmlFor="budget" className="text-gray-900 dark:text-gray-100">Budget (₹)</Label>
                  <Input
                    id="budget"
                    type="number"
                    min="0"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g., 500"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Urgency & Scheduled Date */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="urgency" className="text-gray-900 dark:text-gray-100">Urgency</Label>
                  <select
                    id="urgency"
                    value={formData.urgency}
                    onChange={(e) => setFormData({ ...formData, urgency: e.target.value as 'low' | 'medium' | 'high' })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="scheduledDate" className="text-gray-900 dark:text-gray-100">Preferred Date (Optional)</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={formData.scheduledDate}
                    onChange={(e) => setFormData({ ...formData, scheduledDate: e.target.value })}
                    min={new Date().toISOString().split('T')[0]}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="contactName" className="text-gray-900 dark:text-gray-100">Contact Name</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      placeholder="Your name"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactPhone" className="text-gray-900 dark:text-gray-100">Phone Number</Label>
                    <Input
                      id="contactPhone"
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      placeholder="e.g., +91 9876543210"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <Label htmlFor="contactEmail" className="text-gray-900 dark:text-gray-100">Email</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                      placeholder="your@email.com"
                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={loading}
                  className="border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading && <LoaderOne />}
                  {loading ? 'Posting Job...' : 'Post Job'}
                </Button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                Your job will be reviewed by an admin before being visible to workers.
              </p>
            </CardContent>
          </Card>
        </form>
      </main>
    </div>
  );
}
