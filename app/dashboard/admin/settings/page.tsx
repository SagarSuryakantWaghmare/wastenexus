'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Database, Lock, Palette, Globe } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-10 h-10 text-gray-600" />
            System Settings
          </h1>
          <p className="text-gray-600 mt-2">Configure platform settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Database className="w-6 h-6 text-blue-600" />
                Database Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage database connections and settings</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-red-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Configure authentication and authorization</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Palette className="w-6 h-6 text-purple-600" />
                Theme & Appearance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Customize platform theme and branding</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-green-600" />
                API & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage external API connections</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Advanced configuration options coming soon</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
