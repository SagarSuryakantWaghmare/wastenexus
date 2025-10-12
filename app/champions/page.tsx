"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Shield, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  BarChart3,
  Award,
  Clock,
  Activity,
  ChevronRight,
  Bell,
  Calendar,
  Star
} from "lucide-react";

const ChampionsDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for Green Champions
  const championData = {
    name: "Priya Sharma",
    employeeId: "GC-2024-001",
    level: "Senior Champion",
    areasAssigned: 12,
    totalCitizens: 4580,
    monthlyScore: 94,
    badge: "Environmental Guardian",
    joinDate: "2023-08-15"
  };

  const quickStats = [
    {
      title: "Areas Monitored",
      value: championData.areasAssigned,
      icon: MapPin,
      color: "bg-blue-500",
      change: "+2 this month",
      trend: "up"
    },
    {
      title: "Citizens Engaged",
      value: championData.totalCitizens.toLocaleString(),
      icon: Users,
      color: "bg-green-500",
      change: "+320 this week",
      trend: "up"
    },
    {
      title: "Compliance Score",
      value: `${championData.monthlyScore}%`,
      icon: Shield,
      color: "bg-purple-500",
      change: "+8% improvement",
      trend: "up"
    },
    {
      title: "Issues Resolved",
      value: 147,
      icon: CheckCircle2,
      color: "bg-emerald-500",
      change: "15 today",
      trend: "up"
    }
  ];

  const navigationCards = [
    {
      title: "Area Monitoring",
      description: "Monitor assigned areas, track waste collection, and view real-time status",
      href: "/champions/areas",
      icon: MapPin,
      color: "from-blue-500 to-blue-600",
      stats: "12 Areas Active"
    },
    {
      title: "Compliance Check",
      description: "Conduct compliance audits, report violations, and track improvements",
      href: "/champions/compliance",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      stats: "94% Avg Score"
    },
    {
      title: "Community Engagement",
      description: "Engage with citizens, manage challenges, and build environmental awareness",
      href: "/champions/community",
      icon: Users,
      color: "from-green-500 to-green-600",
      stats: "4.6K Citizens"
    }
  ];

  const recentAlerts = [
    {
      id: 1,
      type: "violation",
      title: "Improper Waste Segregation",
      location: "Sector 15, Block A",
      time: "2 hours ago",
      severity: "medium",
      icon: AlertTriangle
    },
    {
      id: 2,
      type: "achievement",
      title: "Area Compliance Improved",
      location: "Sector 12, Block B",
      time: "4 hours ago",
      severity: "success",
      icon: CheckCircle2
    },
    {
      id: 3,
      type: "milestone",
      title: "1000 Citizens Trained",
      location: "Monthly Milestone",
      time: "1 day ago",
      severity: "info",
      icon: Award
    }
  ];

  const upcomingTasks = [
    {
      id: 1,
      title: "Monthly Compliance Audit",
      area: "Sector 8-12",
      time: "Tomorrow, 10:00 AM",
      priority: "high"
    },
    {
      id: 2,
      title: "Community Workshop",
      area: "Community Center",
      time: "Wednesday, 2:00 PM",
      priority: "medium"
    },
    {
      id: 3,
      title: "Area Inspection",
      area: "Sector 15",
      time: "Friday, 11:00 AM",
      priority: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Star className="w-3 h-3 text-yellow-900" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Welcome back, {championData.name}
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <span>{championData.level}</span>
                  <span>•</span>
                  <span>{championData.badge}</span>
                  <span>•</span>
                  <span>ID: {championData.employeeId}</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Time</p>
                <p className="text-lg font-semibold text-gray-900">
                  {currentTime.toLocaleTimeString('en-IN', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    second: '2-digit'
                  })}
                </p>
              </div>
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-400 hover:text-green-600 cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-green-500" />
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-1">{stat.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
              <p className="text-sm text-green-600 font-medium">{stat.change}</p>
            </div>
          ))}
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {navigationCards.map((card, index) => (
            <Link key={index} href={card.href}>
              <div className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 cursor-pointer">
                <div className={`h-2 bg-gradient-to-r ${card.color}`}></div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center`}>
                      <card.icon className="w-6 h-6 text-white" />
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{card.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{card.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{card.stats}</span>
                    <span className="text-sm text-green-600 font-medium group-hover:text-green-700">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Activity & Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Alerts */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-600" />
                <span>Recent Alerts</span>
              </h2>
              <Link href="/champions/alerts" className="text-sm text-green-600 hover:text-green-700 font-medium">
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {recentAlerts.map((alert) => (
                <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                    alert.severity === 'success' ? 'bg-green-100 text-green-600' :
                    'bg-blue-100 text-blue-600'
                  }`}>
                    <alert.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                    <p className="text-sm text-gray-600">{alert.location}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-green-600" />
                <span>Upcoming Tasks</span>
              </h2>
              <Link href="/champions/schedule" className="text-sm text-green-600 hover:text-green-700 font-medium">
                View Calendar
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-3 h-3 rounded-full ${
                    task.priority === 'high' ? 'bg-red-500' :
                    task.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{task.title}</p>
                    <p className="text-sm text-gray-600">{task.area}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <p className="text-xs text-gray-500">{task.time}</p>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    task.priority === 'high' ? 'bg-red-100 text-red-700' :
                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {task.priority}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span>Monthly Performance</span>
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Target: 90%</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Achieved: {championData.monthlyScore}%</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-3">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - championData.monthlyScore / 100)}`}
                    className="text-green-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-lg font-bold text-gray-900">{championData.monthlyScore}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">Overall Score</p>
              <p className="text-xs text-gray-500">Above Target</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Area Coverage</span>
                <span className="text-sm font-medium text-gray-900">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Citizen Engagement</span>
                <span className="text-sm font-medium text-gray-900">92%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Compliance Rate</span>
                <span className="text-sm font-medium text-gray-900">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-sm font-medium text-gray-900">89%</span>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Award className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-900">Achievement</span>
              </div>
              <p className="text-sm text-green-800 mb-2">Outstanding Performance!</p>
              <p className="text-xs text-green-700">
                You&apos;ve exceeded all targets this month. Keep up the excellent work!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChampionsDashboard;