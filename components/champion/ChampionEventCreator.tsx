"use client";
// AddressAutocompleteInput component using Google Places API (for future use)
import { useState as useInputState } from 'react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function AddressAutocompleteInput({ value, onSelect }: { value: string; onSelect: (address: string) => void }) {
    const [query, setQuery] = useInputState(value || '');
    const [suggestions, setSuggestions] = useInputState<Array<{ 
        description: string; 
        place_id: string;
        structured_formatting?: {
            main_text: string;
            secondary_text: string;
        };
    }>>([]);
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
        } catch {
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative">
            <input
                id="addressInput"
                value={query}
                onChange={e => {
                    setQuery(e.target.value);
                    fetchSuggestions(e.target.value);
                }}
                placeholder="Type address..."
                className="w-full border-2 border-gray-300 bg-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-base"
                autoComplete="off"
            />
            {loading && <div className="text-xs text-gray-400 mt-2">Loading suggestions...</div>}
            {suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border-2 border-gray-200 rounded-lg shadow-lg mt-2 max-h-56 overflow-y-auto w-full">
                    {suggestions.map(suggestion => (
                        <li
                            key={suggestion.place_id}
                            className="px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors border-b border-gray-100 last:border-b-0"
                            onClick={() => {
                                setQuery(suggestion.description);
                                setSuggestions([]);
                                onSelect(suggestion.description);
                            }}
                        >
                            <p className="font-semibold text-gray-900 text-sm">{suggestion.structured_formatting?.main_text || suggestion.description}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{suggestion.structured_formatting?.secondary_text || ''}</p>
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
import { Loader2, Plus, Calendar, MapPin } from 'lucide-react';
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
                headers: {},
            });

            toast.success('Event created successfully!');
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
        <Card className="border-0 shadow-lg bg-white dark:bg-gray-800 transition-colors duration-300">
            <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-b border-green-100 dark:border-gray-700 rounded-t-lg pb-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-green-600/10 dark:bg-green-600/20 rounded-lg">
                        <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <CardTitle className="text-2xl text-green-700 dark:text-green-400">Create New Event</CardTitle>
                </div>
                <CardDescription className="text-gray-600 dark:text-gray-400 text-base">
                    Organize a waste management event for your community
                </CardDescription>
            </CardHeader>

            <CardContent className="pt-8">
                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Section 1: Event Title */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">1</span>
                            Event Basics
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-700 dark:text-gray-300 font-semibold">Event Title *</Label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="e.g., Community Park Cleanup Day"
                                    className="border-2 border-gray-300 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-700 dark:text-gray-300 font-semibold">
                                    Description * <span className="text-xs text-gray-500 dark:text-gray-400 font-normal">(Min. 50 characters)</span>
                                </Label>
                                <Textarea
                                    id="description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe the event in detail... Include goals, what to bring, etc."
                                    rows={5}
                                    className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-transparent resize-none"
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
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">2</span>
                            Location & Details
                        </h3>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="eventAddress" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-green-600 dark:text-green-400" />
                                    Event Address *
                                </Label>
                                <Input
                                    id="eventAddress"
                                    value={location.address}
                                    onChange={e => setLocation({ ...location, address: e.target.value })}
                                    placeholder="Enter event address..."
                                    className="border-2 border-gray-300 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="wasteFocus" className="text-gray-700 dark:text-gray-300 font-semibold">Waste Focus *</Label>
                                    <Select
                                        value={formData.wasteFocus}
                                        onValueChange={(value) => setFormData({ ...formData, wasteFocus: value })}
                                    >
                                        <SelectTrigger className="border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-transparent">
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
                                    <Label htmlFor="eventDate" className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-green-600" />
                                        Date & Time *
                                    </Label>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                        value={formData.eventDate}
                                        onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                                        className="border-2 border-gray-300 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Event Image */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                            <span className="flex items-center justify-center w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">3</span>
                            Event Image
                        </h3>
                        <div className="space-y-3">
                            <Label htmlFor="eventImage" className="text-gray-700 dark:text-gray-300 font-semibold">Event Image *</Label>
                            <FileUpload onChange={(files) => setImageFile(files[0] || null)} />
                            {imageFile && (
                                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                                    <span className="text-green-700 dark:text-green-400 font-semibold text-sm">✓ Selected:</span>
                                    <span className="text-green-600 dark:text-green-400 text-sm">{imageFile.name}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
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
                            className="flex-1 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold py-2.5 rounded-lg transition-all"
                        >
                            Clear Form
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-lg transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4" />
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