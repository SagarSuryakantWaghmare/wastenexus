'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar, Users, MapPin } from 'lucide-react';

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-pink-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Award className="w-10 h-10 text-pink-600" />
            Events Management
          </h1>
          <p className="text-gray-600 mt-2">Manage cleanup events and community activities</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-pink-500 to-pink-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-pink-100 text-sm font-medium mb-1">Total Events</p>
                  <p className="text-4xl font-bold">89</p>
                </div>
                <Award className="w-12 h-12 text-pink-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium mb-1">Upcoming</p>
                  <p className="text-4xl font-bold">12</p>
                </div>
                <Calendar className="w-12 h-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium mb-1">Participants</p>
                  <p className="text-4xl font-bold">2,456</p>
                </div>
                <Users className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium mb-1">Locations</p>
                  <p className="text-4xl font-bold">23</p>
                </div>
                <MapPin className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Calendar</CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Event management interface coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
