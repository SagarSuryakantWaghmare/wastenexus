"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  ArrowLeft, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Calendar,
  Users,
  BarChart3,
  Filter,
  Search,
  Eye,
  RefreshCw,
  Trash2,
  TrendingUp,
  Battery,
  Wifi
} from "lucide-react";

const AreaMonitoringPage = () => {
  const [selectedArea, setSelectedArea] = useState<string | null>("area-1");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "issues" | "completed">("all");

  // Mock data for area monitoring
  const areasData = [
    {
      id: "area-1",
      name: "Sector 15 - Block A",
      status: "active",
      bins: 24,
      fullBins: 3,
      lastCollection: "2 hours ago",
      nextCollection: "Tomorrow 9:00 AM",
      citizens: 450,
      complianceScore: 92,
      issues: 1,
      coordinates: { lat: 12.9716, lng: 77.5946 },
      alerts: [
        { type: "bin_full", message: "Bin #15A-08 is 95% full", time: "30 mins ago" }
      ]
    },
    {
      id: "area-2",
      name: "Sector 12 - Block B",
      status: "completed",
      bins: 18,
      fullBins: 0,
      lastCollection: "4 hours ago",
      nextCollection: "Day after tomorrow 10:00 AM",
      citizens: 320,
      complianceScore: 96,
      issues: 0,
      coordinates: { lat: 12.9616, lng: 77.5846 },
      alerts: []
    },
    {
      id: "area-3",
      name: "Sector 18 - Block C",
      status: "issues",
      bins: 30,
      fullBins: 8,
      lastCollection: "6 hours ago",
      nextCollection: "Today 2:00 PM",
      citizens: 580,
      complianceScore: 78,
      issues: 3,
      coordinates: { lat: 12.9816, lng: 77.6046 },
      alerts: [
        { type: "violation", message: "Improper segregation reported", time: "1 hour ago" },
        { type: "bin_full", message: "Multiple bins reaching capacity", time: "2 hours ago" }
      ]
    },
    {
      id: "area-4",
      name: "Sector 8 - Block D",
      status: "active",
      bins: 22,
      fullBins: 2,
      lastCollection: "3 hours ago",
      nextCollection: "Tomorrow 11:00 AM",
      citizens: 390,
      complianceScore: 88,
      issues: 0,
      coordinates: { lat: 12.9516, lng: 77.5746 },
      alerts: []
    }
  ];

  const smartBinsData = [
    {
      id: "BIN-15A-08",
      location: "Sector 15 - Corner Market",
      fillLevel: 95,
      batteryLevel: 78,
      signalStrength: 85,
      lastUpdate: "5 mins ago",
      temperature: 28,
      status: "critical"
    },
    {
      id: "BIN-15A-12",
      location: "Sector 15 - Residential Complex",
      fillLevel: 67,
      batteryLevel: 92,
      signalStrength: 78,
      lastUpdate: "8 mins ago",
      temperature: 26,
      status: "normal"
    },
    {
      id: "BIN-15A-15",
      location: "Sector 15 - Bus Stop",
      fillLevel: 45,
      batteryLevel: 65,
      signalStrength: 90,
      lastUpdate: "3 mins ago",
      temperature: 29,
      status: "normal"
    }
  ];

  const collectionSchedule = [
    {
      id: 1,
      area: "Sector 15 - Block A",
      time: "9:00 AM - 11:00 AM",
      date: "Tomorrow",
      worker: "Rajesh Kumar",
      vehicleId: "WM-2024-15",
      route: "Route A-15",
      status: "scheduled"
    },
    {
      id: 2,
      area: "Sector 18 - Block C",
      time: "2:00 PM - 4:00 PM",
      date: "Today",
      worker: "Amit Singh",
      vehicleId: "WM-2024-18",
      route: "Route C-18",
      status: "in_progress"
    },
    {
      id: 3,
      area: "Sector 8 - Block D",
      time: "11:00 AM - 1:00 PM",
      date: "Tomorrow",
      worker: "Priya Sharma",
      vehicleId: "WM-2024-08",
      route: "Route D-08",
      status: "scheduled"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-blue-600 bg-blue-100";
      case "completed": return "text-green-600 bg-green-100";
      case "issues": return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return Clock;
      case "completed": return CheckCircle2;
      case "issues": return AlertCircle;
      default: return MapPin;
    }
  };

  const filteredAreas = areasData.filter(area => {
    if (filterStatus === "all") return true;
    return area.status === filterStatus;
  });

  const selectedAreaData = areasData.find(area => area.id === selectedArea);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/champions" className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Area Monitoring</h1>
              <p className="text-gray-600">Real-time monitoring of assigned areas and waste collection</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <RefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </button>
            <div className="flex bg-white border border-gray-300 rounded-lg">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 ${viewMode === "grid" ? "bg-blue-500 text-white" : "text-gray-600"} rounded-l-lg transition-colors`}
              >
                Grid
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-4 py-2 ${viewMode === "map" ? "bg-blue-500 text-white" : "text-gray-600"} rounded-r-lg transition-colors`}
              >
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search areas..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as "all" | "active" | "issues" | "completed")}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Areas</option>
                  <option value="active">Active</option>
                  <option value="issues">Issues</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Active ({areasData.filter(a => a.status === "active").length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Issues ({areasData.filter(a => a.status === "issues").length})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Completed ({areasData.filter(a => a.status === "completed").length})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Areas List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Assigned Areas</h2>
            {filteredAreas.map((area) => {
              const StatusIcon = getStatusIcon(area.status);
              return (
                <div
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`bg-white rounded-xl shadow-lg border border-gray-100 p-4 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                    selectedArea === area.id ? "ring-2 ring-blue-500 border-blue-200" : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <StatusIcon className="w-5 h-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{area.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(area.status)}`}>
                      {area.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-500">Bins</p>
                      <p className="text-sm font-medium">{area.bins} total</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Citizens</p>
                      <p className="text-sm font-medium">{area.citizens}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-green-600">{area.complianceScore}%</span>
                    </div>
                    {area.issues > 0 && (
                      <div className="flex items-center space-x-1">
                        <AlertCircle className="w-4 h-4 text-red-500" />
                        <span className="text-sm text-red-600">{area.issues} issue{area.issues > 1 ? "s" : ""}</span>
                      </div>
                    )}
                  </div>
                  
                  {area.alerts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <p className="text-xs text-gray-600">{area.alerts[0].message}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Area Details */}
          <div className="lg:col-span-2 space-y-6">
            {selectedAreaData && (
              <>
                {/* Area Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{selectedAreaData.name}</h2>
                    <div className="flex items-center space-x-2">
                      <Eye className="w-5 h-5 text-blue-600" />
                      <span className="text-sm text-gray-600">Live View</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <Trash2 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{selectedAreaData.bins}</p>
                      <p className="text-sm text-gray-600">Total Bins</p>
                    </div>
                    <div className="text-center p-4 bg-red-50 rounded-lg">
                      <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-red-600">{selectedAreaData.fullBins}</p>
                      <p className="text-sm text-gray-600">Full Bins</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Users className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-green-600">{selectedAreaData.citizens}</p>
                      <p className="text-sm text-gray-600">Citizens</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-purple-600">{selectedAreaData.complianceScore}%</p>
                      <p className="text-sm text-gray-600">Compliance</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Clock className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Last Collection</p>
                        <p className="text-sm text-gray-600">{selectedAreaData.lastCollection}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Next Collection</p>
                        <p className="text-sm text-gray-600">{selectedAreaData.nextCollection}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Smart Bins Monitor */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Smart Bins Status</h3>
                  <div className="space-y-4">
                    {smartBinsData.map((bin) => (
                      <div key={bin.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{bin.id}</h4>
                            <p className="text-sm text-gray-600">{bin.location}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            bin.status === "critical" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                          }`}>
                            {bin.status}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Trash2 className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Fill Level</p>
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${bin.fillLevel > 80 ? "bg-red-500" : bin.fillLevel > 60 ? "bg-yellow-500" : "bg-green-500"}`}
                                    style={{ width: `${bin.fillLevel}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm font-medium">{bin.fillLevel}%</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Battery className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Battery</p>
                              <p className="text-sm font-medium">{bin.batteryLevel}%</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Wifi className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Signal</p>
                              <p className="text-sm font-medium">{bin.signalStrength}%</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-gray-500" />
                            <div>
                              <p className="text-xs text-gray-500">Updated</p>
                              <p className="text-sm font-medium">{bin.lastUpdate}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collection Schedule */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Collection Schedule</h3>
                  <div className="space-y-4">
                    {collectionSchedule.map((schedule) => (
                      <div key={schedule.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className={`w-4 h-4 rounded-full ${
                            schedule.status === "in_progress" ? "bg-blue-500" : "bg-gray-400"
                          }`}></div>
                          <div>
                            <h4 className="font-medium text-gray-900">{schedule.area}</h4>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>{schedule.date} • {schedule.time}</span>
                              <span>Worker: {schedule.worker}</span>
                              <span>Vehicle: {schedule.vehicleId}</span>
                            </div>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          schedule.status === "in_progress" ? "bg-blue-100 text-blue-700" : 
                          schedule.status === "scheduled" ? "bg-yellow-100 text-yellow-700" : 
                          "bg-green-100 text-green-700"
                        }`}>
                          {schedule.status.replace("_", " ")}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AreaMonitoringPage;