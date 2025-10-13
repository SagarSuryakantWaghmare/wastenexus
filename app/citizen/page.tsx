"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import { Award, Camera, TrendingUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

export default function CitizenDashboard() {
const [userData, setUserData] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(user);
        
        if (user?._id) {
          // Only fetch leaderboard data
          const leaderboardRes = await fetch('/api/leaderboard?limit=5');
          const leaderboardData = await leaderboardRes.json();
          
          if (leaderboardData?.data?.leaderboard) {
            setLeaderboard(leaderboardData.data.leaderboard);
          }
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64 bg-gray-100 rounded-lg"></div>
            <div className="h-64 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {userData?.name?.split(' ')[0] || 'Citizen'}! 🌱
            </h1>
            <p className="text-gray-600">Let's make an impact together</p>
          </div>
          <div className="flex gap-3 mt-4 md:mt-0">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/citizen/report-waste">
                <Camera className="w-4 h-4 mr-2" />
                Report Waste
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Report Waste Card */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5 text-green-600" />
                  Report Waste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <Camera className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">Report Waste in Your Area</h3>
                  <p className="text-gray-500 mb-6">Help keep your community clean and earn rewards</p>
                  <Link href="/citizen/report-waste">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <Camera className="mr-2 h-4 w-4" /> Report Waste Now
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leaderboard */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Leaderboard
                </CardTitle>
                <CardDescription>Top eco-warriors</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {leaderboard.length > 0 ? (
                  leaderboard.map((user, index) => (
                    <div 
                      key={user._id || index} 
                      className={`flex items-center gap-3 p-3 rounded-lg ${
                        user._id === userData?._id ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-white' :
                        index === 1 ? 'bg-gray-400 text-white' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-300 text-gray-700'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">
                          {user._id === userData?._id ? 'You' : user.name?.split(' ')[0] || 'User'}
                        </p>
                        <p className="text-xs text-gray-600">{user.points || 0} points</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 py-4">No leaderboard data available</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
