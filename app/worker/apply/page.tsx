"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, MapPin, Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function WorkerApplicationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [aadhaarPreview, setAadhaarPreview] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    locationCoordinates: { lat: 0, lng: 0 },
  });

  const [files, setFiles] = useState({
    photo: null as File | null,
    aadhaarCard: null as File | null,
  });

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocoding using OpenStreetMap Nominatim
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();

          setFormData({
            ...formData,
            address: data.display_name || `${latitude}, ${longitude}`,
            locationCoordinates: { lat: latitude, lng: longitude },
          });

          toast.success("Location detected successfully!");
        } catch (error) {
          console.error("Error reverse geocoding:", error);
          toast.error("Failed to get address from coordinates");
        } finally {
          setDetectingLocation(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.error("Failed to detect location. Please enter manually.");
        setDetectingLocation(false);
      }
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'photo' | 'aadhaarCard') => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      setFiles({ ...files, [type]: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'photo') {
          setPhotoPreview(reader.result as string);
        } else {
          setAadhaarPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.email || !formData.phone || !formData.address) {
        toast.error("Please fill all required fields");
        setLoading(false);
        return;
      }

      if (!files.photo) {
        toast.error("Please upload your photo");
        setLoading(false);
        return;
      }

      if (!files.aadhaarCard) {
        toast.error("Please upload your Aadhaar card");
        setLoading(false);
        return;
      }

      // Create FormData for file upload
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      submitData.append('locationCoordinates', JSON.stringify(formData.locationCoordinates));
      submitData.append('photo', files.photo);
      submitData.append('aadhaarCard', files.aadhaarCard);

      const response = await fetch('/api/worker-applications', {
        method: 'POST',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(data.error || "Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-100 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm md:text-base">
                Thank you for applying to join as a worker. Our admin team will review your application and contact you via email once verified.
              </p>
              <Button
                onClick={() => router.push('/')}
                className="w-full md:w-auto px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 dark:bg-gray-900 py-12 px-4 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-6">
          <Button
            type="button"
            onClick={() => router.back()}
            variant="outline"
            className="inline-flex items-center h-12 px-3 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 bg-white/0 hover:bg-gray-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 mb-2">
            Join as a Worker
          </h1>
          <p className="text-gray-700 dark:text-gray-300 text-base md:text-lg">
            Fill out the application form to become a waste collection worker
          </p>
        </div>

        <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg">
          <CardHeader className="bg-emerald-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <CardTitle className="text-gray-900 dark:text-gray-100 font-bold">Worker Application Form</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Please provide accurate information. All fields are required.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 px-6 md:px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Personal Information</h3>
                
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    required
                    className="mt-1 h-12 px-3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      required
                      className="mt-1 h-12 px-3"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 XXXXXXXXXX"
                      required
                      className="mt-1 h-12 px-3"
                    />
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Address</h3>
                
                <div>
                  <Label htmlFor="address">Your Address *</Label>
                  <div className="flex gap-2 items-center mt-2">
                    <Input
                      id="address"
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter your address or use auto-detect"
                      required
                      className="flex-1 h-12 px-3 rounded-lg"
                    />
                    <Button
                      type="button"
                      onClick={handleAutoDetectLocation}
                      disabled={detectingLocation}
                      variant="outline"
                      className="border-emerald-300 dark:border-emerald-700 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 h-12 px-4 rounded-lg flex items-center"
                    >
                      {detectingLocation ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Detecting...
                        </>
                      ) : (
                        <>
                          <MapPin className="mr-2 h-4 w-4" />
                          Auto-detect
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click &quot;Auto-detect&quot; to use your current location
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-4">
                <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100">Documents</h3>
                
                {/* Photo Upload */}
                <div>
                  <Label htmlFor="photo">Your Photo *</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-40 min-h-[9rem] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors p-3"
                    >
                      {photoPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={photoPreview}
                            alt="Photo preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                            Click to upload your photo
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'photo')}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* Aadhaar Card Upload */}
                <div>
                  <Label htmlFor="aadhaarCard">Aadhaar Card *</Label>
                  <div className="mt-2">
                    <label
                      htmlFor="aadhaarCard"
                      className="flex flex-col items-center justify-center w-full h-40 min-h-[9rem] border border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors p-3"
                    >
                      {aadhaarPreview ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={aadhaarPreview}
                            alt="Aadhaar preview"
                            fill
                            className="object-contain rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-gray-400" />
                          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300">
                            Click to upload Aadhaar card
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            PNG, JPG (MAX. 5MB)
                          </p>
                        </div>
                      )}
                      <input
                        id="aadhaarCard"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'aadhaarCard')}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Upload a clear photo of your Aadhaar card for verification
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold text-sm md:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting Application...
                    </>
                  ) : (
                    "Submit Application"
                  )}
                </Button>
                <p className="text-xs md:text-sm text-center text-gray-600 dark:text-gray-400 mt-3">
                  By submitting, you agree to our terms and conditions
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
