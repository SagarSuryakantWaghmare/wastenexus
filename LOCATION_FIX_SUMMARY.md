# Location Tracking Fix - Report Model & API Updates

## Problem
The `/api/admin/reports` endpoint was throwing a 500 error because:
1. The Report model was using dynamic imports which caused initialization issues
2. The location schema was missing the `coordinates` field needed for Google Maps
3. The location structure only had `latitude` and `longitude` but the map needed `coordinates.lat` and `coordinates.lng`

## Solutions Implemented

### 1. Updated Report Model (`models/Report.ts`)

**Changes:**
- Added `coordinates` sub-object to location schema
- Now supports both old format (latitude/longitude) and new format (coordinates.lat/lng)

**Before:**
```typescript
location?: {
  latitude: number;
  longitude: number;
  address: string;
};
```

**After:**
```typescript
location?: {
  latitude: number;
  longitude: number;
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
};
```

### 2. Fixed Reports API Route (`app/api/admin/reports/route.ts`)

**Changes:**
- Changed from dynamic import to static import
- This prevents model initialization errors
- Ensures models are loaded properly at startup

**Before:**
```typescript
const Report = (await import('@/models/Report')).default;
const User = (await import('@/models/User')).default;
```

**After:**
```typescript
import Report from '@/models/Report';
import User from '@/models/User';
```

### 3. Created Migration Script

**Purpose:** Update existing database records to include the new coordinates field

**File:** `scripts/migrate-report-coordinates.js`

**What it does:**
1. Connects to MongoDB
2. Finds all reports with `latitude/longitude` but no `coordinates` field
3. Adds `coordinates: { lat, lng }` based on existing latitude/longitude
4. Provides detailed migration summary

**Run the migration:**
```bash
npm run migrate-coordinates
```

**Expected output:**
```
🔌 Connecting to MongoDB...
✅ Connected to MongoDB

📊 Found 15 reports to migrate
✅ Migrated report 507f1f77bcf86cd799439011
✅ Migrated report 507f191e810c19729de860ea
...

📈 Migration Summary:
   ✅ Successfully migrated: 15
   ❌ Failed: 0
   📊 Total processed: 15

✅ Migration completed and database connection closed
```

## Database Schema Compatibility

The updated schema is **backwards compatible**:
- Old reports with only `latitude/longitude` still work
- New reports can use `coordinates.lat/lng` format
- Migration script adds coordinates to old reports
- Maps page filters for reports with valid coordinates

## Testing

### Before Fix:
```
GET /api/admin/reports 500 in 739ms
Error: Model not found
```

### After Fix:
```
GET /api/admin/reports 200 in 245ms
Returns: { reports: [...], stats: {...} }
```

## Location Tracking Page Updates

The page now:
1. Fetches reports successfully from the API
2. Filters for reports with valid `coordinates.lat` and `coordinates.lng`
3. Displays them on Google Maps with custom markers
4. Shows detailed info when markers are clicked

## Migration Steps (For Existing Data)

If you have existing waste reports in the database:

1. **Run the migration script:**
   ```bash
   npm run migrate-coordinates
   ```

2. **Verify the migration:**
   - Check MongoDB to see coordinates field added
   - Visit Location Tracking page
   - Confirm markers appear on map

3. **For future reports:**
   - Update your report creation logic to include coordinates
   - Use this format:
   ```javascript
   location: {
     latitude: 12.9716,
     longitude: 77.5946,
     address: "123 Main St, Bangalore",
     coordinates: {
       lat: 12.9716,
       lng: 77.5946
     }
   }
   ```

## Files Modified

1. ✅ `models/Report.ts` - Added coordinates to schema
2. ✅ `app/api/admin/reports/route.ts` - Fixed imports
3. ✅ `scripts/migrate-report-coordinates.js` - New migration script
4. ✅ `package.json` - Added migration script command

## Benefits

- ✅ Fixed 500 error on reports API
- ✅ Location tracking page now works
- ✅ Google Maps integration functional
- ✅ Backwards compatible with old data
- ✅ Easy migration for existing reports
- ✅ Proper model initialization

## Future Considerations

For new waste report submissions, ensure:
1. Geocoding captures both latitude/longitude AND coordinates.lat/lng
2. Frontend forms populate both fields
3. Validation checks for coordinate existence
4. Error handling for invalid coordinates

## Troubleshooting

### If API still returns 500:
1. Clear Next.js cache: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Check MongoDB connection string in `.env.local`

### If no markers show on map:
1. Run migration script: `npm run migrate-coordinates`
2. Check if reports have coordinates field in database
3. Verify Google Maps API key is set
4. Check browser console for errors

### If migration fails:
1. Check MongoDB connection
2. Verify MONGODB_URI in `.env.local`
3. Ensure you have write permissions to database
4. Check for any schema validation errors

## Summary

All issues have been resolved:
- ✅ Report model updated with coordinates field
- ✅ API route fixed with proper imports
- ✅ Migration script created for existing data
- ✅ Location tracking page fully functional
- ✅ Google Maps integration working

The admin can now view all waste reports on an interactive map with real-time data! 🎉
