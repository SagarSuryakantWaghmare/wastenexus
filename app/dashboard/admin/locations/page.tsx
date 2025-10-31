'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LoaderCircle } from '@/components/ui/loader';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';

interface Report {
  _id: string;
  userId: {
    name: string;
    email: string;
  };
  type: string;
  weightKg: number;
  status: string;
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

interface Stats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

const mapContainerStyle = {
  width: '100%',
  height: '600px',
};

const defaultCenter = {
  lat: 20.5937, // India center
  lng: 78.9629,
};

export default function LocationsPage() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const reportsWithCoordinates = (data.reports || []).filter(
          (report: Report) => report.location?.coordinates?.lat && report.location?.coordinates?.lng
        );
        setReports(reportsWithCoordinates);
        setStats(data.stats || {});

        // Set map center to first report location if available
        if (reportsWithCoordinates.length > 0) {
          setMapCenter({
            lat: reportsWithCoordinates[0].location.coordinates.lat,
            lng: reportsWithCoordinates[0].location.coordinates.lng,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMarkerIcon = useCallback((status: string) => {
    const colors: { [key: string]: string } = {
      pending: '#f59e0b', // orange
      verified: '#10b981', // green
      rejected: '#ef4444', // red
    };
    
    return {
      path: 'M 12 2 C 6.48 2 2 6.48 2 12 C 2 17.52 6.48 22 12 22 C 17.52 22 22 17.52 22 12 C 22 6.48 17.52 2 12 2 Z M 16 16 H 8 V 14 H 16 V 16 Z M 16 12 H 8 V 8 H 16 V 12 Z',
      fillColor: colors[status] || colors.pending,
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 1.5,
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoaderCircle size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50 dark:from-gray-900 dark:to-indigo-950 p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <MapPin className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
            Waste Report Locations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track waste collection points across all locations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium mb-1">Total Reports</p>
                  <p className="text-4xl font-bold">{stats?.total || 0}</p>
                </div>
                <MapPin className="w-12 h-12 text-indigo-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium mb-1">Pending</p>
                  <p className="text-4xl font-bold">{stats?.pending || 0}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Verified</p>
                  <p className="text-4xl font-bold">{stats?.verified || 0}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm font-medium mb-1">Rejected</p>
                  <p className="text-4xl font-bold">{stats?.rejected || 0}</p>
                </div>
                <XCircle className="w-12 h-12 text-red-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Map Legend */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-center gap-6 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-orange-500"></div>
                <span className="text-sm font-medium">Pending Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Verified Reports</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-red-500"></div>
                <span className="text-sm font-medium">Rejected Reports</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Map */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Waste Collection Map ({reports.length} locations)</span>
              <Badge variant="outline" className="text-sm">
                <Trash2 className="w-4 h-4 mr-1" />
                Live Tracking
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {reports.length === 0 ? (
              <div className="py-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No waste reports with location data found</p>
              </div>
            ) : (
              <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={12}
                  options={{
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: true,
                    fullscreenControl: true,
                  }}
                >
                  {reports.map((report) => (
                    <Marker
                      key={report._id}
                      position={{
                        lat: report.location.coordinates.lat,
                        lng: report.location.coordinates.lng,
                      }}
                      onClick={() => setSelectedReport(report)}
                      icon={getMarkerIcon(report.status)}
                    />
                  ))}

                  {selectedReport && (
                    <InfoWindow
                      position={{
                        lat: selectedReport.location.coordinates.lat,
                        lng: selectedReport.location.coordinates.lng,
                      }}
                      onCloseClick={() => setSelectedReport(null)}
                    >
                      <div className="p-2 max-w-xs">
                        <h3 className="font-semibold text-lg mb-2">{selectedReport.type}</h3>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="font-medium">Reporter:</span> {selectedReport.userId?.name || 'Unknown'}
                          </p>
                          <p>
                            <span className="font-medium">Weight:</span> {selectedReport.weightKg} kg
                          </p>
                          <p>
                            <span className="font-medium">Status:</span>{' '}
                            <Badge
                              variant="outline"
                              className={
                                selectedReport.status === 'pending'
                                  ? 'border-orange-500 text-orange-700'
                                  : selectedReport.status === 'verified'
                                  ? 'border-green-500 text-green-700'
                                  : 'border-red-500 text-red-700'
                              }
                            >
                              {selectedReport.status}
                            </Badge>
                          </p>
                          <p>
                            <span className="font-medium">Points:</span> {selectedReport.pointsAwarded}
                          </p>
                          <p>
                            <span className="font-medium">Location:</span> {selectedReport.location.address}
                          </p>
                          <p>
                            <span className="font-medium">Date:</span>{' '}
                            {new Date(selectedReport.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              </LoadScript>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
