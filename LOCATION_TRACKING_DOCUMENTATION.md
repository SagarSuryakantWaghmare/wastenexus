# Waste Report Location Tracking - Google Maps Integration

## Overview
The Location Tracking page displays all waste reports on an interactive Google Map with custom trash bin icons. Each marker represents a waste report location with real-time status indicators.

## Features Implemented

### 1. **Interactive Google Map**
- Full-screen map interface (600px height)
- Custom trash bin markers for each waste report
- Color-coded markers based on report status:
  - 🟠 **Orange** - Pending reports
  - 🟢 **Green** - Verified reports
  - 🔴 **Red** - Rejected reports

### 2. **Real-time Statistics Dashboard**
Four stat cards showing:
- **Total Reports** - All waste reports with location data
- **Pending** - Reports awaiting verification
- **Verified** - Approved and validated reports
- **Rejected** - Reports that were declined

### 3. **Interactive Markers**
- Click on any marker to view detailed information
- Info window displays:
  - Waste type (plastic, cardboard, e-waste, etc.)
  - Reporter name
  - Weight in kilograms
  - Status with color-coded badge
  - Points awarded
  - Full address
  - Report date

### 4. **Map Legend**
- Visual guide showing marker color meanings
- Helps identify report status at a glance

### 5. **Auto-centering**
- Map automatically centers on the first report location
- Default center: India (lat: 20.5937, lng: 78.9629)

## Technical Implementation

### Dependencies
```bash
npm install @react-google-maps/api
```

### Environment Variables
Add to your `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Google Maps API Setup

1. **Get API Key:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing one
   - Navigate to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"

2. **Enable Required APIs:**
   - Maps JavaScript API (Required)
   - Places API (Optional, for future features)
   - Geocoding API (Optional, for address lookup)

3. **Restrict API Key (Recommended):**
   - Application restrictions: HTTP referrers
   - Add your domain: `http://localhost:3000/*` (development)
   - Add production domain: `https://yourdomain.com/*`

4. **API Restrictions:**
   - Restrict key to "Maps JavaScript API"

### Data Flow
1. Page loads and calls `/api/admin/reports` endpoint
2. Filters reports to only include those with valid coordinates
3. Displays filtered reports on the map
4. Updates statistics cards with real-time data

### Map Customization

The map includes these controls:
- ✅ Zoom control
- ✅ Map type control (Roadmap, Satellite, Terrain)
- ✅ Fullscreen control
- ❌ Street view control (disabled)

## Usage

### For Admins:
1. Navigate to **Dashboard > Location Tracking**
2. View the interactive map with all waste report locations
3. Click any marker to see detailed report information
4. Use the legend to understand marker colors
5. Use map controls to zoom, pan, and change map types

### Filtering Reports:
The page automatically filters to show only reports with:
- Valid latitude coordinates
- Valid longitude coordinates
- Non-null location data

## Future Enhancements

Potential features to add:
- 🔄 Real-time updates with WebSocket
- 📍 Clustering for dense areas
- 🗺️ Route planning for collection
- 📊 Heatmap visualization
- 🔍 Search by location
- 📅 Date range filtering
- 🎯 Filter by waste type
- 📱 Mobile-responsive improvements
- 🚛 Collection vehicle tracking
- 📈 Historical location trends

## Troubleshooting

### Map not loading:
1. Check if API key is correctly set in `.env.local`
2. Verify API key has Maps JavaScript API enabled
3. Check browser console for CORS or API key errors
4. Ensure domain is added to API key restrictions

### No markers showing:
1. Verify reports have valid coordinate data in database
2. Check network tab for API call to `/api/admin/reports`
3. Ensure reports array is being populated
4. Check console for React/rendering errors

### Markers in wrong location:
1. Verify coordinate format (lat/lng not lng/lat)
2. Check if coordinates are within valid ranges:
   - Latitude: -90 to 90
   - Longitude: -180 to 180

## API Response Format

Expected report structure:
```typescript
{
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  type: string; // waste type
  weightKg: number;
  status: 'pending' | 'verified' | 'rejected';
  pointsAwarded: number;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  date: string;
  imageUrl?: string;
}
```

## Performance Considerations

- Only reports with valid coordinates are rendered
- Map markers are memoized to prevent re-renders
- Info window only opens for selected marker
- Lazy loading of map component

## Security Notes

- API key is public (NEXT_PUBLIC_*) but restricted to specific domains
- Admin authentication required to access the page
- JWT token verification on API endpoints
- Rate limiting recommended for production

## Browser Support

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Credits

- Map powered by Google Maps JavaScript API
- Icons from Lucide React
- Built with Next.js 15.5.5 and React 19
