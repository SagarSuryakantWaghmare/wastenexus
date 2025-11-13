"use client";

import { useState } from 'react';
import Image from 'next/image';
import { useApi } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileUpload } from '@/components/ui/file-upload';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Save } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import { toast } from 'sonner';

interface EventData {
    title: string;
    description: string;
    wasteFocus: string;
    eventDate: string;
    locationName?: string;
    locationAddress?: string;
    imageUrl?: string;
}

interface ChampionEventEditorProps {
    eventId: string;
    initialData: EventData;
    onEventUpdated: () => void;
}

export function ChampionEventEditor({ eventId, initialData, onEventUpdated }: ChampionEventEditorProps) {
    const { apiCall } = useApi();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: initialData.title || '',
        description: initialData.description || '',
        wasteFocus: initialData.wasteFocus || '',
        eventDate: initialData.eventDate ? new Date(initialData.eventDate).toISOString().slice(0, 16) : '',
    });
    const [location, setLocation] = useState<{ name: string; address: string }>({
        name: initialData.locationName || '',
        address: initialData.locationAddress || ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [detectingLocation, setDetectingLocation] = useState(false);

    const wasteFocusOptions = [
        { value: 'Waste Collection', label: 'Waste Collection' },
        { value: 'Tree Plantation', label: 'Tree Plantation' },
        { value: 'E-Waste Drive', label: 'E-Waste Drive' },
        { value: 'Beach Cleanup', label: 'Beach Cleanup' },
        { value: 'Recycling Workshop', label: 'Recycling Workshop' },
        { value: 'Awareness Campaign', label: 'Awareness Campaign' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.wasteFocus || !location.address || !formData.eventDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.description.length < 50) {
            toast.error('Description must be at least 50 characters');
            return;
        }

        setIsSubmitting(true);

        try {
            // If there's a new image, upload it first
            let imageUrl = initialData.imageUrl;
            if (imageFile) {
                const form = new FormData();
                form.append('image', imageFile);

                const uploadRes = await apiCall('/api/upload', {
                    method: 'POST',
                    body: form,
                    headers: {},
                });

                imageUrl = uploadRes.secure_url;
            }

            // Update the event
            await apiCall(`/api/events/${eventId}`, {
                method: 'PUT',
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    wasteFocus: formData.wasteFocus,
                    locationName: location.name,
                    locationAddress: location.address,
                    eventDate: formData.eventDate,
                    imageUrl: imageUrl,
                }),
            });

            toast.success('Event updated successfully!');
            onEventUpdated();
        } catch (error) {
            console.error('Error updating event:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to update event');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="shadow-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20 border-b-2 border-gray-200 dark:border-gray-700 rounded-t-lg pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                        <Calendar className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl sm:text-2xl text-gray-900 dark:text-gray-100">Edit Event</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                    Update your event details
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-6 sm:pt-8">
                <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
                    
                    {/* Section 1: Event Title */}
                    <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">1</span>
                            Event Basics
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Community Park Cleanup Day"
                                    className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                                    Description * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Min. 50 characters)</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the event in detail... Include goals, what to bring, etc."
                                    rows={5}
                                    className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-transparent resize-none text-sm sm:text-base"
                                    required
                                />
                                <div className="flex justify-between items-center">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {formData.description.length} / 50 characters minimum
                                    </p>
                                    {formData.description.length >= 50 && (
                                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold">✓ Valid</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Location & Details */}
                    <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">2</span>
                            Location & Details
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="eventAddress" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                    <MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                    Event Address *
                                </Label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <Input
                                        id="eventAddress"
                                        value={location.address}
                                        onChange={e => setLocation({ ...location, address: e.target.value })}
                                        placeholder="Enter event address..."
                                        className="border-2 border-gray-300 focus:border-transparent flex-1 text-sm sm:text-base"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            if (!navigator.geolocation) {
                                                toast.error('Geolocation is not supported by your browser');
                                                return;
                                            }
                                            setDetectingLocation(true);
                                            navigator.geolocation.getCurrentPosition(async (pos) => {
                                                try {
                                                    const { latitude, longitude } = pos.coords;
                                                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
                                                    const data = await res.json();
                                                    const display = data.display_name || '';
                                                    const name = data.name || (data.address && (data.address.road || data.address.neighbourhood || data.address.suburb)) || 'Current location';
                                                    setLocation({ name, address: display });
                                                    toast.success('Location detected');
                                                } catch (err) {
                                                    console.error('Reverse geocode failed', err);
                                                    toast.error('Failed to detect location');
                                                } finally {
                                                    setDetectingLocation(false);
                                                }
                                            }, (err) => {
                                                console.error('Geolocation error', err);
                                                toast.error('Unable to get your location');
                                                setDetectingLocation(false);
                                            }, { enableHighAccuracy: true, timeout: 10000 });
                                        }}
                                        className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm w-full sm:w-auto justify-center"
                                    >
                                        {detectingLocation ? <LoaderCircle size="sm" className="inline-block" /> : 'Auto-detect'}
                                    </button>
                                </div>
                                {location.name && (
                                    <p className="text-xs text-gray-500">Detected: <span className="font-medium">{location.name}</span></p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="wasteFocus" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">Waste Focus *</Label>
                                    <Select
                                        value={formData.wasteFocus}
                                        onValueChange={(value) => setFormData({ ...formData, wasteFocus: value })}
                                    >
                                        <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-transparent text-sm sm:text-base">
                                            <SelectValue placeholder="Select waste focus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {wasteFocusOptions.map((option) => (
                                                <SelectItem key={option.value} value={option.value}>
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="eventDate" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                                        <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                                        Date & Time *
                                    </Label>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        className="border-2 border-gray-300 focus:border-transparent text-sm sm:text-base"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Event Image */}
                    <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-bold">3</span>
                            Event Image
                        </h3>
                        <div className="space-y-3">
                            <Label htmlFor="eventImage" className="text-gray-700 dark:text-gray-300 font-semibold text-sm sm:text-base">
                                Update Event Image {!imageFile && '(Optional - keep current image)'}
                            </Label>
                            {!imageFile && initialData.imageUrl && (
                                <div className="mb-3">
                                    <div className="relative w-full h-48 sm:h-64 rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-600">
                                        <Image
                                            src={initialData.imageUrl || ''}
                                            alt="Current event"
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-semibold px-2 py-1 rounded-md shadow">
                                            Current Image
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Upload a new image to replace this one</p>
                                </div>
                            )}
                            <FileUpload onChange={(files) => setImageFile(files[0] || null)} />
                            {imageFile && (
                                <div className="flex items-center gap-2 p-3 bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700 rounded-lg">
                                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold text-sm">✓ New image selected:</span>
                                    <span className="text-emerald-600 dark:text-emerald-400 text-sm truncate">{imageFile.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {isSubmitting ? (
                                <>
                                    <LoaderCircle size="sm" className="inline-block" />
                                    Updating...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
