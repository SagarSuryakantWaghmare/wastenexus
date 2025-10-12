"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Shield, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Plus,
  Filter,
  Search,
  Download,
  Eye,
  Edit,
  Star,
  TrendingUp,
  TrendingDown,
  MapPin,
  Calendar,
  User,
  BarChart3,
  Award
} from "lucide-react";

const ComplianceCheckPage = () => {
  const [activeTab, setActiveTab] = useState<"audits" | "violations" | "reports">("audits");
  const [showNewAuditForm, setShowNewAuditForm] = useState(false);

  // Mock compliance data
  const complianceAudits = [
    {
      id: "AUDIT-2024-001",
      area: "Sector 15 - Block A",
      date: "2024-09-15",
      auditor: "Priya Sharma",
      score: 92,
      status: "completed",
      violations: 2,
      improvements: 5,
      nextAudit: "2024-10-15",
      categories: {
        segregation: 95,
        binMaintenance: 88,
        citizenCompliance: 94,
        collectionTiming: 90
      }
    },
    {
      id: "AUDIT-2024-002",
      area: "Sector 18 - Block C",
      date: "2024-09-14",
      auditor: "Priya Sharma",
      score: 78,
      status: "review_required",
      violations: 5,
      improvements: 8,
      nextAudit: "2024-09-21",
      categories: {
        segregation: 72,
        binMaintenance: 85,
        citizenCompliance: 75,
        collectionTiming: 80
      }
    },
    {
      id: "AUDIT-2024-003",
      area: "Sector 12 - Block B",
      date: "2024-09-13",
      auditor: "Priya Sharma",
      score: 96,
      status: "completed",
      violations: 0,
      improvements: 2,
      nextAudit: "2024-10-13",
      categories: {
        segregation: 98,
        binMaintenance: 95,
        citizenCompliance: 96,
        collectionTiming: 95
      }
    }
  ];

  const violations = [
    {
      id: "VIO-2024-045",
      type: "improper_segregation",
      severity: "medium",
      area: "Sector 15 - Block A",
      reportedBy: "Citizen App",
      date: "2024-09-15",
      status: "resolved",
      description: "Mixed organic and plastic waste in green bin",
      action: "Citizen education provided",
      resolvedDate: "2024-09-15"
    },
    {
      id: "VIO-2024-046",
      type: "overflowing_bin",
      severity: "high",
      area: "Sector 18 - Block C",
      reportedBy: "Smart Sensor",
      date: "2024-09-14",
      status: "pending",
      description: "Bin exceeding capacity for 24+ hours",
      action: "Emergency collection scheduled",
      resolvedDate: null
    },
    {
      id: "VIO-2024-047",
      type: "missed_collection",
      severity: "high",
      area: "Sector 20 - Block F",
      reportedBy: "Worker Report",
      date: "2024-09-13",
      status: "escalated",
      description: "Collection missed due to vehicle breakdown",
      action: "Backup vehicle deployed",
      resolvedDate: "2024-09-14"
    }
  ];

  const complianceReports = [
    {
      id: "REP-2024-09",
      title: "Monthly Compliance Report - September 2024",
      period: "September 2024",
      areas: 12,
      avgScore: 89,
      totalViolations: 23,
      resolvedViolations: 18,
      pendingViolations: 5,
      generatedDate: "2024-09-15",
      status: "generated"
    },
    {
      id: "REP-2024-08",
      title: "Monthly Compliance Report - August 2024",
      period: "August 2024",
      areas: 12,
      avgScore: 86,
      totalViolations: 31,
      resolvedViolations: 29,
      pendingViolations: 2,
      generatedDate: "2024-08-31",
      status: "submitted"
    }
  ];

  const getViolationSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low": return "bg-blue-100 text-blue-700 border-blue-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-700";
      case "pending": return "bg-yellow-100 text-yellow-700";
      case "escalated": return "bg-red-100 text-red-700";
      case "resolved": return "bg-green-100 text-green-700";
      case "review_required": return "bg-orange-100 text-orange-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/champions" className="p-2 hover:bg-white rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Compliance Management</h1>
              <p className="text-gray-600">Monitor compliance, conduct audits, and track violations</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setShowNewAuditForm(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Audit</span>
            </button>
            <button className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Download className="w-4 h-4" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg Compliance Score</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">89%</p>
            <p className="text-sm text-green-600 font-medium">+3% this month</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Audits This Month</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">12</p>
            <p className="text-sm text-blue-600 font-medium">3 completed today</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Open Violations</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">5</p>
            <p className="text-sm text-red-600 font-medium">-18 resolved</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-500" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Top Performing Areas</h3>
            <p className="text-2xl font-bold text-gray-900 mb-2">8</p>
            <p className="text-sm text-green-600 font-medium">Above 90% score</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab("audits")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "audits" 
                    ? "border-purple-500 text-purple-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Compliance Audits
              </button>
              <button
                onClick={() => setActiveTab("violations")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "violations" 
                    ? "border-purple-500 text-purple-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Violations & Issues
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "reports" 
                    ? "border-purple-500 text-purple-600" 
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                Compliance Reports
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
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <select className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Review Required</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === "audits" && (
              <div className="space-y-4">
                {complianceAudits.map((audit) => (
                  <div key={audit.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{audit.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(audit.status)}`}>
                            {audit.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{audit.area}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{audit.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{audit.auditor}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Star className="w-5 h-5 text-yellow-500" />
                            <span className="text-2xl font-bold text-gray-900">{audit.score}%</span>
                          </div>
                          <p className="text-sm text-gray-600">Compliance Score</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Eye className="w-5 h-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600">{audit.categories.segregation}%</div>
                        <div className="text-xs text-gray-600">Segregation</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600">{audit.categories.binMaintenance}%</div>
                        <div className="text-xs text-gray-600">Bin Maintenance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600">{audit.categories.citizenCompliance}%</div>
                        <div className="text-xs text-gray-600">Citizen Compliance</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600">{audit.categories.collectionTiming}%</div>
                        <div className="text-xs text-gray-600">Collection Timing</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="flex items-center space-x-2">
                          <AlertTriangle className="w-4 h-4 text-red-500" />
                          <span className="text-gray-600">{audit.violations} violations</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="text-gray-600">{audit.improvements} improvements</span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Next audit: {audit.nextAudit}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "violations" && (
              <div className="space-y-4">
                {violations.map((violation) => (
                  <div key={violation.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{violation.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getViolationSeverityColor(violation.severity)}`}>
                            {violation.severity} severity
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(violation.status)}`}>
                            {violation.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{violation.area}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>{violation.date}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>Reported by: {violation.reportedBy}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{violation.description}</p>
                        <p className="text-sm text-green-600 font-medium">Action: {violation.action}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Edit className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {violation.resolvedDate && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2 text-sm text-green-600">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Resolved on {violation.resolvedDate}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-4">
                {complianceReports.map((report) => (
                  <div key={report.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{report.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <span>Period: {report.period}</span>
                          <span>Areas: {report.areas}</span>
                          <span>Generated: {report.generatedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                          {report.status}
                        </span>
                        <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{report.avgScore}%</div>
                        <div className="text-sm text-gray-600">Avg Score</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{report.totalViolations}</div>
                        <div className="text-sm text-gray-600">Total Violations</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{report.resolvedViolations}</div>
                        <div className="text-sm text-gray-600">Resolved</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{report.pendingViolations}</div>
                        <div className="text-sm text-gray-600">Pending</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* New Audit Form Modal */}
        {showNewAuditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Start New Audit</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Area</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Sector 15 - Block A</option>
                    <option>Sector 18 - Block C</option>
                    <option>Sector 12 - Block B</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audit Type</label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                    <option>Routine Inspection</option>
                    <option>Complaint Follow-up</option>
                    <option>Special Audit</option>
                  </select>
                </div>
                <div className="flex items-center space-x-3 pt-4">
                  <button 
                    onClick={() => setShowNewAuditForm(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => setShowNewAuditForm(false)}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Start Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ComplianceCheckPage;