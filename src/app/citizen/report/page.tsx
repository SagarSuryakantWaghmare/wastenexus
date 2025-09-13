'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Camera, 
  MapPin, 
  Upload,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Calendar,
  Filter,
  Eye,
  Trash2,
  Recycle,
  Leaf,
  AlertCircle
} from "lucide-react";
import { mockWasteReports } from "@/data/mockData";

export default function ReportPage() {
  const [activeTab, setActiveTab] = useState('new-report');
  const [formData, setFormData] = useState({
    location: '',
    description: '',
    wasteTypes: [] as string[],
    severity: 'medium' as 'low' | 'medium' | 'high',
    photos: [] as File[]
  });

  const wasteTypeOptions = [
    { id: 'plastic', label: 'Plastic', icon: Recycle, color: 'text-blue-500' },
    { id: 'organic', label: 'Organic', icon: Leaf, color: 'text-green-500' },
    { id: 'paper', label: 'Paper', icon: Trash2, color: 'text-yellow-500' },
    { id: 'glass', label: 'Glass', icon: Recycle, color: 'text-purple-500' },
    { id: 'metal', label: 'Metal', icon: Recycle, color: 'text-gray-500' },
    { id: 'electronic', label: 'E-Waste', icon: AlertCircle, color: 'text-red-500' },
  ];

  const handleWasteTypeToggle = (type: string) => {
    setFormData(prev => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(type)
        ? prev.wasteTypes.filter(t => t !== type)
        : [...prev.wasteTypes, type]
    }));
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...files]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would submit the form data
    console.log('Submitting report:', formData);
    // Reset form
    setFormData({
      location: '',
      description: '',
      wasteTypes: [],
      severity: 'medium',
      photos: []
    });
    setActiveTab('my-reports');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      reported: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      assigned: { color: 'bg-blue-100 text-blue-800', icon: User },
      collected: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      verified: { color: 'bg-purple-100 text-purple-800', icon: CheckCircle }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.reported;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getSeverityBadge = (severity: string) => {
    const severityConfig = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    };
    
    return (
      <Badge className={severityConfig[severity as keyof typeof severityConfig]}>
        {severity.charAt(0).toUpperCase() + severity.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Waste Reports</h1>
            <p className="text-gray-600 mt-2">Report waste issues and track their resolution</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <User className="w-3 h-3 mr-1" />
              {mockWasteReports.length} Reports Submitted
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
              <Camera className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockWasteReports.length}</div>
              <p className="text-xs text-gray-500">All time submissions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Resolved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockWasteReports.filter(r => r.status === 'collected' || r.status === 'verified').length}
              </div>
              <p className="text-xs text-gray-500">Successfully addressed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockWasteReports.filter(r => r.status === 'reported' || r.status === 'assigned').length}
              </div>
              <p className="text-xs text-gray-500">Awaiting action</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Earned</CardTitle>
              <Leaf className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75</div>
              <p className="text-xs text-gray-500">From reporting</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="new-report">New Report</TabsTrigger>
            <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="new-report" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-orange-500" />
                  Report Waste Issue
                </CardTitle>
                <CardDescription>
                  Help keep your community clean by reporting waste issues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Enter the location or address"
                        value={formData.location}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-gray-500">
                      Be as specific as possible to help waste collection teams
                    </p>
                  </div>

                  {/* Waste Types */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Waste Types</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {wasteTypeOptions.map((option) => (
                        <div
                          key={option.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all ${
                            formData.wasteTypes.includes(option.id)
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => handleWasteTypeToggle(option.id)}
                        >
                          <div className="flex items-center space-x-2">
                            <option.icon className={`h-4 w-4 ${option.color}`} />
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Severity */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Severity Level</label>
                    <div className="grid grid-cols-3 gap-3">
                      {(['low', 'medium', 'high'] as const).map((level) => (
                        <div
                          key={level}
                          className={`p-3 border rounded-lg cursor-pointer text-center transition-all ${
                            formData.severity === level
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setFormData(prev => ({ ...prev, severity: level }))}
                        >
                          <div className="flex items-center justify-center space-x-2">
                            <AlertTriangle className={`h-4 w-4 ${
                              level === 'low' ? 'text-green-500' :
                              level === 'medium' ? 'text-yellow-500' : 'text-red-500'
                            }`} />
                            <span className="text-sm font-medium capitalize">{level}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <Textarea
                      placeholder="Describe the waste issue in detail..."
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      rows={4}
                      required
                    />
                  </div>

                  {/* Photo Upload */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">Photos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Click to upload photos or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG up to 10MB each (max 5 photos)
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                        id="photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        Choose Files
                      </Button>
                    </div>
                    {formData.photos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Selected Photos:</p>
                        <div className="space-y-1">
                          {formData.photos.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <span className="text-sm text-gray-700">{file.name}</span>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => setFormData(prev => ({
                                  ...prev,
                                  photos: prev.photos.filter((_, i) => i !== index)
                                }))}
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1 bg-orange-600 hover:bg-orange-700">
                      <Camera className="w-4 h-4 mr-2" />
                      Submit Report
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setFormData({
                        location: '',
                        description: '',
                        wasteTypes: [],
                        severity: 'medium',
                        photos: []
                      })}
                    >
                      Clear Form
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-reports" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Reports
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button variant="outline" size="sm">All Status</Button>
                  <Button variant="outline" size="sm">Pending</Button>
                  <Button variant="outline" size="sm">Resolved</Button>
                  <Button variant="outline" size="sm">High Priority</Button>
                </div>
              </CardContent>
            </Card>

            {/* Reports List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockWasteReports.map((report) => (
                <Card key={report.id} className="hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          Report #{report.id.split('_')[1]}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {report.location.address}
                        </CardDescription>
                      </div>
                      {getStatusBadge(report.status)}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      {getSeverityBadge(report.severity)}
                      {report.wasteTypes.map((type) => (
                        <Badge key={type} variant="outline" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-700">{report.description}</p>
                    
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(report.reportedAt).toLocaleDateString()}
                      </div>
                      {report.collectedAt && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Collected {new Date(report.collectedAt).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    
                    {report.aiClassification && (
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs font-medium text-blue-800 mb-1">
                          AI Analysis (Confidence: {Math.round(report.aiClassification.confidence * 100)}%)
                        </p>
                        <ul className="text-xs text-blue-700 space-y-1">
                          {report.aiClassification.suggestions.map((suggestion, index) => (
                            <li key={index} className="flex items-start gap-1">
                              <span>•</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {report.photos.length > 0 && (
                        <Button variant="outline" size="sm">
                          <Camera className="w-3 h-3 mr-1" />
                          Photos ({report.photos.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}