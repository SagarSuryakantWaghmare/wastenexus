'use client';

import { useState, useCallback } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';

interface LocationPickerProps {
  onLocationSelect: (location: {
    latitude: number;
    longitude: number;
    address: string;
  }) => void;
  initialLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
}
const containerStyle = {
  width: '100%',
  height: '300px',
  borderRadius: '8px',
};

const defaultCenter = {
  lat: 20.5937, // India center
  lng: 78.9629,
};

export function LocationPicker({ onLocationSelect, initialLocation }: LocationPickerProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  });

  const [markerPosition, setMarkerPosition] = useState(
    initialLocation
      ? { lat: initialLocation.latitude, lng: initialLocation.longitude }
      : defaultCenter
  );
  const [address, setAddress] = useState(initialLocation?.address || '');

  const onMapClick = useCallback(
    async (e: google.maps.MapMouseEvent) => {
      if (!e.latLng) return;

      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      setMarkerPosition({ lat, lng });

      // Reverse geocoding to get address
      try {
        const geocoder = new google.maps.Geocoder();
        const result = await geocoder.geocode({ location: { lat, lng } });
        if (result.results[0]) {
          const addressText = result.results[0].formatted_address;
          setAddress(addressText);
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: addressText,
          });
        }
      } catch (error) {
        console.error('Geocoding error:', error);
      }
    },
    [onLocationSelect]
  );

  if (!isLoaded) {
    return (
      <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Location</Label>
        {/* Removed getCurrentLocation button for autocomplete-only picker */}
      </div>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={markerPosition}
        zoom={12}
        onClick={onMapClick}
      >
        <Marker position={markerPosition} />
      </GoogleMap>

      <Input
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Selected address will appear here"
        readOnly
        className="bg-gray-50"
      />
      <p className="text-xs text-gray-500">
        Click on the map to select a location or use your current location
      </p>
    </div>
  );
}
