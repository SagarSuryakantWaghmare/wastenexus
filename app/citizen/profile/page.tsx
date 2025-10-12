'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  User, 
  Mail, 
  Phone,
  MapPin,
  Calendar,
  Edit,
  Save,
  Camera,
  Award,
  TrendingUp,
  Target,
  Leaf,
  BookOpen,
  Shield,
  Bell,
  Eye,
  Lock
} from "lucide-react";
import { mockUser, mockCertificates, mockWasteReports } from "@/data/mockData";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: mockUser.name,
    email: mockUser.email,
    phone: mockUser.phone,
    street: mockUser.address.street,
    city: mockUser.address.city,
    state: mockUser.address.state,
    pincode: mockUser.address.pincode,
    bio: ''
  });

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: mockUser.name,
      email: mockUser.email,
      phone: mockUser.phone,
      street: mockUser.address.street,
      city: mockUser.address.city,
      state: mockUser.address.state,
      pincode: mockUser.address.pincode,
      bio: ''
    });
    setIsEditing(false);
  };

  const profileStats = {
    totalCredits: mockUser.greenCredits,
    certificatesEarned: mockCertificates.length,
    reportsSubmitted: mockWasteReports.length,
    trainingProgress: mockUser.trainingProgress,
    joinedDays: Math.floor((new Date().getTime() - new Date(mockUser.joinedDate).getTime()) / (1000 * 60 * 60 * 24)),
    rank: 42 // Mock rank
  };

  const achievements = [
    {
      id: 'first-report',
      title: 'First Reporter',
      description: 'Submitted your first waste report',
      icon: Camera,
      earned: true,
      date: '2024-01-20'
    },
    {
      id: 'training-complete',
      title: 'Learning Enthusiast',
      description: 'Completed 3 training modules',
      icon: BookOpen,
      earned: true,
      date: '2024-02-15'
    },
    {
      id: 'green-champion',
      title: 'Green Champion',
      description: 'Earned 500+ green credits',
      icon: Leaf,
      earned: false,
      progress: (mockUser.greenCredits / 500) * 100
    },
    {
      id: 'community-leader',
      title: 'Community Leader',
      description: 'Top 10% in your area',
      icon: Award,
      earned: false,
      progress: 75
    }
  ];

  const activityData = [
    { month: 'Jan', reports: 2, training: 1, credits: 45 },
    { month: 'Feb', reports: 1, training: 2, credits: 65 },
    { month: 'Mar', reports: 3, training: 1, credits: 38 },
    { month: 'Apr', reports: 2, training: 3, credits: 85 },
    { month: 'May', reports: 4, training: 2, credits: 92 },
    { month: 'Jun', reports: 1, training: 1, credits: 34 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account and track your progress</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Member since {new Date(mockUser.joinedDate).getFullYear()}
            </Badge>
            <Badge variant="outline" className="text-sm">
              Rank #{profileStats.rank}
            </Badge>
          </div>
        </div>

        {/* Profile Overview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              {/* Avatar Section */}
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/avatars/citizen.jpg" alt={mockUser.name} />
                    <AvatarFallback className="text-2xl font-semibold bg-blue-100 text-blue-700">
                      {mockUser.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-3 w-3" />
                  </Button>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-semibold">{mockUser.name}</h2>
                  <p className="text-gray-600 capitalize">{mockUser.role}</p>
                  <Badge variant="outline" className="mt-2">
                    Active {profileStats.joinedDays} days
                  </Badge>
                </div>
              </div>

              {/* Profile Stats Grid */}
              <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Leaf className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{profileStats.totalCredits}</div>
                  <div className="text-sm text-gray-600">Green Credits</div>
                </div>
                
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-600">{profileStats.certificatesEarned}</div>
                  <div className="text-sm text-gray-600">Certificates</div>
                </div>
                
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Camera className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{profileStats.reportsSubmitted}</div>
                  <div className="text-sm text-gray-600">Reports</div>
                </div>
                
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{profileStats.trainingProgress}%</div>
                  <div className="text-sm text-gray-600">Training</div>
                </div>
                
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">#{profileStats.rank}</div>
                  <div className="text-sm text-gray-600">Ranking</div>
                </div>
                
                <div className="text-center p-4 bg-indigo-50 rounded-lg">
                  <Target className="h-6 w-6 text-indigo-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-indigo-600">85%</div>
                  <div className="text-sm text-gray-600">Goal Progress</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and contact information</CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "destructive" : "outline"}
                    onClick={isEditing ? handleCancel : () => setIsEditing(true)}
                  >
                    {isEditing ? 'Cancel' : <><Edit className="w-4 h-4 mr-2" />Edit</>}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Full Name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Email Address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({...prev, phone: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Address Information */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Street Address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.street}
                          onChange={(e) => setFormData(prev => ({...prev, street: e.target.value}))}
                          disabled={!isEditing}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">City</label>
                        <Input
                          value={formData.city}
                          onChange={(e) => setFormData(prev => ({...prev, city: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
                        <Input
                          value={formData.state}
                          onChange={(e) => setFormData(prev => ({...prev, state: e.target.value}))}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Pincode</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => setFormData(prev => ({...prev, pincode: e.target.value}))}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>

                {/* Bio Section */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Bio</label>
                  <Textarea
                    placeholder="Tell us about yourself and your commitment to environmental sustainability..."
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({...prev, bio: e.target.value}))}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button onClick={handleSave} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={handleCancel} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Account Details */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
                <CardDescription>Your account information and membership details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Member Since</span>
                      <span className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(mockUser.joinedDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Active</span>
                      <span className="text-sm font-medium">
                        {new Date(mockUser.lastActive).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Account Type</span>
                      <Badge variant="outline" className="capitalize">
                        {mockUser.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Verification Status</span>
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Privacy Level</span>
                      <Badge variant="outline">Public Profile</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Achievements & Badges</CardTitle>
                <CardDescription>Your accomplishments and progress milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className={`p-4 border rounded-lg ${
                      achievement.earned ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-full ${
                          achievement.earned ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <achievement.icon className={`h-6 w-6 ${
                            achievement.earned ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                          {achievement.earned ? (
                            <div className="flex items-center gap-1 mt-2">
                              <Calendar className="w-3 h-3 text-green-600" />
                              <span className="text-xs text-green-600">
                                Earned on {achievement.date ? new Date(achievement.date).toLocaleDateString() : 'Unknown date'}
                              </span>
                            </div>
                          ) : achievement.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex justify-between text-xs text-gray-600 mb-1">
                                <span>Progress</span>
                                <span>{Math.round(achievement.progress)}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${achievement.progress}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Activity Overview</CardTitle>
                <CardDescription>Your engagement and activity patterns over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activityData.map((data) => (
                    <div key={data.month} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{data.month} 2024</span>
                        <div className="flex gap-4 text-xs">
                          <span className="text-orange-600">{data.reports} reports</span>
                          <span className="text-blue-600">{data.training} training</span>
                          <span className="text-green-600">{data.credits} credits</span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-orange-500 via-blue-500 to-green-500 h-2 rounded-full"
                          style={{ width: `${Math.min((data.reports + data.training + data.credits) / 10, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Notifications */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notifications
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about your activities</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Alerts</p>
                        <p className="text-sm text-gray-600">Important notifications via SMS</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Profile Visibility</p>
                        <p className="text-sm text-gray-600">Control who can see your profile</p>
                      </div>
                      <Button variant="outline" size="sm">Manage</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Activity Sharing</p>
                        <p className="text-sm text-gray-600">Share your achievements publicly</p>
                      </div>
                      <Button variant="outline" size="sm">Configure</Button>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <Lock className="h-5 w-5" />
                    Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Change Password</p>
                        <p className="text-sm text-gray-600">Update your account password</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-600">Add an extra layer of security</p>
                      </div>
                      <Button variant="outline" size="sm">Enable</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}