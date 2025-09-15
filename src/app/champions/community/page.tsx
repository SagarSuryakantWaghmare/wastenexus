"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  Trophy, 
  Star, 
  Award, 
  Target,
  Plus,
  Filter,
  Search,
  TrendingUp,
  Medal,
  Calendar,
  MapPin,
  Eye,
  Gift,
  Zap,
  Crown,
  ChevronRight,
  BarChart3,
  CheckCircle2
} from "lucide-react";

const CommunityEngagementPage = () => {
  const [activeTab, setActiveTab] = useState<"leaderboard" | "challenges" | "engagement" | "events">("leaderboard");

  // Mock community data
  const leaderboardData = [
    {
      rank: 1,
      name: "Rajesh Kumar",
      area: "Sector 15 - Block A",
      points: 2850,
      level: "Eco Champion",
      badges: 12,
      streak: 45,
      avatar: "/avatar1.jpg",
      improvement: "+150"
    },
    {
      rank: 2,
      name: "Priya Sharma",
      area: "Sector 12 - Block B",
      points: 2720,
      level: "Green Guardian",
      badges: 10,
      streak: 38,
      avatar: "/avatar2.jpg",
      improvement: "+85"
    },
    {
      rank: 3,
      name: "Amit Singh",
      area: "Sector 18 - Block C",
      points: 2650,
      level: "Green Guardian",
      badges: 9,
      streak: 42,
      avatar: "/avatar3.jpg",
      improvement: "+120"
    },
    {
      rank: 4,
      name: "Sunita Devi",
      area: "Sector 8 - Block D",
      points: 2480,
      level: "Eco Warrior",
      badges: 8,
      streak: 29,
      avatar: "/avatar4.jpg",
      improvement: "+95"
    },
    {
      rank: 5,
      name: "Mohammed Ali",
      area: "Sector 20 - Block F",
      points: 2350,
      level: "Eco Warrior",
      badges: 7,
      streak: 33,
      avatar: "/avatar5.jpg",
      improvement: "+70"
    }
  ];

  const challenges = [
    {
      id: "CHAL-001",
      title: "Zero Waste Week",
      description: "Achieve 100% waste segregation for 7 consecutive days",
      participants: 1250,
      completions: 847,
      rewards: "500 Green Credits + Eco Badge",
      duration: "7 days",
      startDate: "2024-09-20",
      endDate: "2024-09-27",
      status: "active",
      difficulty: "medium",
      category: "segregation"
    },
    {
      id: "CHAL-002",
      title: "Community Clean Drive",
      description: "Organize neighborhood cleanup and report waste hotspots",
      participants: 890,
      completions: 234,
      rewards: "1000 Green Credits + Leader Badge",
      duration: "14 days",
      startDate: "2024-09-15",
      endDate: "2024-09-29",
      status: "active",
      difficulty: "hard",
      category: "community"
    },
    {
      id: "CHAL-003",
      title: "Composting Champion",
      description: "Create home compost and share progress photos",
      participants: 650,
      completions: 421,
      rewards: "300 Green Credits + Compost Kit",
      duration: "30 days",
      startDate: "2024-09-01",
      endDate: "2024-09-30",
      status: "ending_soon",
      difficulty: "easy",
      category: "composting"
    }
  ];

  const engagementStats = [
    {
      area: "Sector 15 - Block A",
      citizens: 450,
      activeUsers: 387,
      engagementRate: 86,
      averageScore: 94,
      topContributor: "Rajesh Kumar",
      recentActivity: "2 hours ago"
    },
    {
      area: "Sector 12 - Block B", 
      citizens: 320,
      activeUsers: 298,
      engagementRate: 93,
      averageScore: 96,
      topContributor: "Priya Sharma",
      recentActivity: "1 hour ago"
    },
    {
      area: "Sector 18 - Block C",
      citizens: 580,
      activeUsers: 478,
      engagementRate: 82,
      averageScore: 78,
      topContributor: "Amit Singh",
      recentActivity: "30 mins ago"
    }
  ];

  const communityEvents = [
    {
      id: "EVT-001",
      title: "Monthly Green Champions Meetup",
      description: "Community gathering to discuss environmental initiatives",
      date: "2024-09-25",
      time: "6:00 PM - 8:00 PM",
      location: "Community Center, Sector 15",
      attendees: 156,
      maxAttendees: 200,
      organizer: "Priya Sharma",
      type: "meetup",
      status: "upcoming"
    },
    {
      id: "EVT-002",
      title: "Composting Workshop",
      description: "Learn home composting techniques from experts",
      date: "2024-09-28",
      time: "10:00 AM - 12:00 PM",
      location: "Green Park, Sector 12",
      attendees: 89,
      maxAttendees: 150,
      organizer: "Rajesh Kumar",
      type: "workshop",
      status: "upcoming"
    },
    {
      id: "EVT-003",
      title: "Waste Segregation Training",
      description: "Interactive training session for new residents",
      date: "2024-09-30",
      time: "4:00 PM - 6:00 PM",
      location: "Society Hall, Sector 18",
      attendees: 67,
      maxAttendees: 100,
      organizer: "Amit Singh",
      type: "training",
      status: "upcoming"
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-100 text-green-700 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "hard": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-700";
      case "ending_soon": return "bg-orange-100 text-orange-700";
      case "completed": return "bg-blue-100 text-blue-700";
      case "upcoming": return "bg-purple-100 text-purple-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "Eco Champion": return Crown;
      case "Green Guardian": return Medal;
      case "Eco Warrior": return Award;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/champions" className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Community Engagement</h1>
              <p className="text-gray-600">Foster environmental awareness and community participation</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>New Event</span>
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Gift className="w-4 h-4" />
              <span>Rewards</span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Citizens</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">1,163</p>
            <p className="text-sm text-green-600 font-medium">+12% this week</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Engagement</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">87%</p>
            <p className="text-sm text-blue-600 font-medium">Above target</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <Zap className="w-5 h-5 text-purple-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Challenges</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">3</p>
            <p className="text-sm text-purple-600 font-medium">2,790 participants</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Events This Month</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">8</p>
            <p className="text-sm text-yellow-600 font-medium">312 total attendees</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("leaderboard")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "leaderboard" 
                    ? "border-green-500 text-green-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Leaderboard
              </button>
              <button
                onClick={() => setActiveTab("challenges")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "challenges" 
                    ? "border-green-500 text-green-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => setActiveTab("engagement")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "engagement" 
                    ? "border-green-500 text-green-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Area Engagement
              </button>
              <button
                onClick={() => setActiveTab("events")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "events" 
                    ? "border-green-500 text-green-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Community Events
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Search and Filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent">
                    <option>All Areas</option>
                    <option>Sector 15</option>
                    <option>Sector 12</option>
                    <option>Sector 18</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === "leaderboard" && (
              <div className="space-y-4">
                {leaderboardData.map((citizen, index) => {
                  const LevelIcon = getLevelIcon(citizen.level);
                  return (
                    <div key={citizen.rank} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                            index === 0 ? "bg-gradient-to-br from-yellow-400 to-yellow-600" :
                            index === 1 ? "bg-gradient-to-br from-gray-400 to-gray-600" :
                            index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600" :
                            "bg-gradient-to-br from-green-400 to-green-600"
                          }`}>
                            {citizen.rank === 1 && <Crown className="w-6 h-6" />}
                            {citizen.rank === 2 && <Medal className="w-6 h-6" />}
                            {citizen.rank === 3 && <Award className="w-6 h-6" />}
                            {citizen.rank > 3 && <span>#{citizen.rank}</span>}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold text-gray-900">{citizen.name}</h3>
                              <LevelIcon className="w-5 h-5 text-yellow-500" />
                              <span className="text-sm font-medium text-yellow-600">{citizen.level}</span>
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-4 h-4" />
                                <span>{citizen.area}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Award className="w-4 h-4" />
                                <span>{citizen.badges} badges</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Zap className="w-4 h-4" />
                                <span>{citizen.streak} day streak</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2 mb-1">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-2xl font-bold text-gray-900">{citizen.points.toLocaleString()}</span>
                          </div>
                          <p className="text-sm text-green-600 font-medium">{citizen.improvement} this week</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === "challenges" && (
              <div className="space-y-6">
                {challenges.map((challenge) => (
                  <div key={challenge.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(challenge.difficulty)}`}>
                            {challenge.difficulty}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(challenge.status)}`}>
                            {challenge.status.replace("_", " ")}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{challenge.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{challenge.participants} participants</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{challenge.completions} completed</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{challenge.duration}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-600">
                          {Math.round((challenge.completions / challenge.participants) * 100)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(challenge.completions / challenge.participants) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-purple-500" />
                        <span className="text-sm font-medium text-purple-600">{challenge.rewards}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Ends: {challenge.endDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "engagement" && (
              <div className="space-y-4">
                {engagementStats.map((area, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{area.area}</h3>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{area.citizens} total citizens</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-4 h-4" />
                            <span>{area.activeUsers} active users</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4" />
                            <span>Top: {area.topContributor}</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{area.engagementRate}%</div>
                        <div className="text-sm text-gray-600">Engagement Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{area.averageScore}%</div>
                        <div className="text-sm text-gray-600">Average Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-gray-600">Last Activity</div>
                        <div className="text-sm font-medium text-gray-900">{area.recentActivity}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "events" && (
              <div className="space-y-4">
                {communityEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3">{event.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{event.date} • {event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{event.attendees}/{event.maxAttendees} attendees</span>
                          </div>
                        </div>
                      </div>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-600">
                        Organized by: <span className="font-medium text-gray-900">{event.organizer}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-600">
                          {Math.round((event.attendees / event.maxAttendees) * 100)}% full
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default CommunityEngagementPage;