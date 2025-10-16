"use client";
// AddressAutocompleteInput component using Google Places API
import { useState as useInputState } from 'react';

function AddressAutocompleteInput({ value, onSelect }: { value: string; onSelect: (address: string) => void }) {
    const [query, setQuery] = useInputState(value || '');
    const [suggestions, setSuggestions] = useInputState<any[]>([]);
    const [loading, setLoading] = useInputState(false);
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    const fetchSuggestions = async (input: string) => {
        if (!input) {
            setSuggestions([]);
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${GOOGLE_API_KEY}&types=address`
            );
            const data = await res.json();
            setSuggestions(data.predictions || []);
        } catch (err) {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <Input
                id="addressInput"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                }}
                placeholder="Type address..."
                className="border-green-200"
                autoComplete="off"
            />
            {loading && <div className="text-xs text-gray-400">Loading suggestions...</div>}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-green-100 rounded shadow mt-1 max-h-48 overflow-y-auto w-full">
                    {suggestions.map(suggestion => (
                        <li
                            key={suggestion.place_id}
                            className="px-3 py-2 cursor-pointer hover:bg-green-50"
                            onClick={() => {
                                setQuery(suggestion.description);
                                setSuggestions([]);
                                onSelect(suggestion.description);
                            }}
                        >
                            <span className="font-semibold">{suggestion.structured_formatting.main_text}</span>
                            <span className="text-xs text-gray-500 ml-2">{suggestion.structured_formatting.secondary_text}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

import { useState } from 'react';
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
import { Loader2, Plus, Calendar } from 'lucide-react';
import { LocationPicker } from '@/components/LocationPicker';
import { toast } from 'sonner';

interface ChampionEventCreatorProps {
    onEventCreated: () => void;
}

export function ChampionEventCreator({ onEventCreated }: ChampionEventCreatorProps) {
    const { apiCall } = useApi();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        wasteFocus: '',
        eventDate: '',
    });
    const [location, setLocation] = useState<{ name: string; address: string }>({ name: '', address: '' });
    const [imageFile, setImageFile] = useState<File | null>(null);

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

        // Validation
        if (!formData.title || !formData.description || !formData.wasteFocus || !location.address || !formData.eventDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        if (formData.description.length < 50) {
            toast.error('Description must be at least 50 characters');
            return;
        }

        if (!imageFile) {
            toast.error('Please upload an event image');
            return;
        }

        setIsSubmitting(true);

        try {
            const form = new FormData();
            form.append('title', formData.title);
            form.append('description', formData.description);
            form.append('wasteFocus', formData.wasteFocus);
            form.append('locationName', location.name);
            form.append('locationAddress', location.address);
            form.append('date', formData.eventDate);
            form.append('image', imageFile);

            await apiCall('/api/events', {
                method: 'POST',
                body: form,
                headers: {}, // Let browser set Content-Type for FormData
            });

            toast.success('Event created successfully!');
            // Reset form
            setFormData({
                title: '',
                description: '',
                wasteFocus: '',
                eventDate: '',
            });
            setLocation({ name: '', address: '' });
            setImageFile(null);
            onEventCreated();
        } catch (error) {
            console.error('Error creating event:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to create event');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="border-green-200 shadow-xl">
            <CardHeader>
                <CardTitle className="text-green-700 flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Create New Event
                </CardTitle>
                <CardDescription>
                    Organize a waste management event for your community
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Left column: all text inputs */}
                        <div className="space-y-4">
                            {/* Event Title */}
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Community Park Cleanup Day"
                                    className="border-green-200"
                                    required
                                />
                            </div>
                            {/* Description */}
                            <div className="space-y-2">
                                <Label htmlFor="description">
                                    Description * <span className="text-xs text-gray-500">(Min. 50 characters)</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the event in detail... Include goals, what to bring, etc."
                                    rows={5}
                                    className="border-green-200"
                                    required
                                />
                                <p className="text-xs text-gray-500">
                                    {formData.description.length} / 50 characters minimum
                                </p>
                            </div>
                            {/* Address Autocomplete Input for Event Location */}
                            <div className="space-y-6 ">
                                <Label htmlFor="eventAddress">Event Address *</Label>
                                <div className="mb-10">
                                    <Input
                                        id="eventAddress"
                                        value={location.address}
                                        onChange={e => setLocation({ ...location, address: e.target.value })}
                                        placeholder="Enter event address..."
                                        className="border-green-200"
                                        required
                                    />
                                </div>
                            </div>
                            {/* Waste Focus and Date/Time side by side */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 space-y-2 md:space-y-0 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="wasteFocus">Waste Focus *</Label>
                                    <Select
                                        value={formData.wasteFocus}
                                        onValueChange={(value) => setFormData({ ...formData, wasteFocus: value })}
                                    >
                                        <SelectTrigger className="border-green-200">
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
                                    <Label htmlFor="eventDate">Date & Time *</Label>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        className="border-green-200"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                        {/* Right column: image upload */}
                        <div className="space-y-2 flex flex-col justify-between h-full">
                            <Label htmlFor="eventImage">Event Image *</Label>
                            <FileUpload
                                onChange={(files) => setImageFile(files[0] || null)}
                            />
                            {imageFile && (
                                <div className="mt-2 text-xs text-green-700">Selected: {imageFile.name}</div>
                            )}
                        </div>
                    </div>



                    {/* Submit Button */}
                    <div className="flex gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setFormData({
                                    title: '',
                                    description: '',
                                    wasteFocus: '',
                                    eventDate: '',
                                });
                                setLocation({ name: '', address: '' });
                                setImageFile(null);
                            }}
                            className="flex-1 border-green-200"
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create Event
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
