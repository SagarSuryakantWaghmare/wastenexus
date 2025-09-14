'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Shield, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  HardHat,
  EyeIcon,
  Truck,
  FileCheck,
  Calendar,
  User,
  ClipboardList,
  AlertCircle,
  Save,
  RotateCcw
} from "lucide-react";
import { 
  mockSafetyChecklist,
  mockWorker,
  mockVehicles,
  type SafetyChecklistItem
} from "@/data/mockData";

interface ChecklistState {
  [key: string]: boolean;
}

export default function SafetyChecklistPage() {
  const [activeTab, setActiveTab] = useState('pre-shift');
  const [preShiftChecklist, setPreShiftChecklist] = useState<ChecklistState>({});
  const [postShiftChecklist, setPostShiftChecklist] = useState<ChecklistState>({});
  
  const assignedVehicle = mockVehicles.find(v => v.id === mockWorker.vehicle_id);
  
  // Get checklists by type
  const preShiftItems = mockSafetyChecklist.pre_shift_checks;
  const postShiftItems = mockSafetyChecklist.post_shift_checks;
  
  // Calculate completion stats
  const getCompletionStats = (items: SafetyChecklistItem[], checklist: ChecklistState) => {
    const completed = items.filter(item => checklist[item.id]).length;
    const total = items.length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, total, percentage };
  };

  const preShiftStats = getCompletionStats(preShiftItems, preShiftChecklist);
  const postShiftStats = getCompletionStats(postShiftItems, postShiftChecklist);

  const handleCheckboxChange = (itemId: string, checked: boolean, type: 'pre' | 'post') => {
    if (type === 'pre') {
      setPreShiftChecklist(prev => ({ ...prev, [itemId]: checked }));
    } else {
      setPostShiftChecklist(prev => ({ ...prev, [itemId]: checked }));
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'personal_safety': return <User className="h-4 w-4 text-blue-500" />;
      case 'vehicle_inspection': return <Truck className="h-4 w-4 text-green-500" />;
      case 'pre_shift': return <Clock className="h-4 w-4 text-orange-500" />;
      case 'post_shift': return <FileCheck className="h-4 w-4 text-purple-500" />;
      default: return <ClipboardList className="h-4 w-4 text-gray-500" />;
    }
  };

  const renderChecklistItems = (items: SafetyChecklistItem[], checklist: ChecklistState, type: 'pre' | 'post') => {
    // Group items by category
    const groupedItems = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(item);
      return acc;
    }, {} as Record<string, SafetyChecklistItem[]>);

    return Object.entries(groupedItems).map(([category, categoryItems]) => (
      <Card key={category}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            {getCategoryIcon(category)}
            {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {categoryItems.map((item) => (
              <div key={item.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={item.id}
                  checked={checklist[item.id] || false}
                  onCheckedChange={(checked) => handleCheckboxChange(item.id, checked as boolean, type)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <label htmlFor={item.id} className="text-sm font-medium cursor-pointer">
                    {item.name}
                  </label>
                  {item.notes && (
                    <p className="text-xs text-gray-600 mt-1">{item.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={item.required ? "destructive" : "secondary"} className="text-xs">
                      {item.required ? 'Required' : 'Optional'}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {item.category.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Safety Checklist</h1>
            <p className="text-gray-600 mt-2">Complete safety checks before and after your shift</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <User className="w-3 h-3 mr-1" />
              {mockWorker.name}
            </Badge>
            <Badge variant="outline" className="text-sm">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date().toLocaleDateString()}
            </Badge>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pre-Shift Status</CardTitle>
              <Clock className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{preShiftStats.percentage}%</div>
              <p className="text-xs text-gray-500">{preShiftStats.completed}/{preShiftStats.total} completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Post-Shift Status</CardTitle>
              <FileCheck className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{postShiftStats.percentage}%</div>
              <p className="text-xs text-gray-500">{postShiftStats.completed}/{postShiftStats.total} completed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vehicle</CardTitle>
              <Truck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{assignedVehicle?.registration_number}</div>
              <p className="text-xs text-gray-500">{assignedVehicle?.type}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Safety Score</CardTitle>
              <Shield className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">98%</div>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pre-shift">Pre-Shift Checklist</TabsTrigger>
            <TabsTrigger value="post-shift">Post-Shift Checklist</TabsTrigger>
            <TabsTrigger value="history">Safety History</TabsTrigger>
          </TabsList>

          <TabsContent value="pre-shift" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pre-Shift Safety Checklist</h3>
                <p className="text-sm text-gray-600">
                  Complete all mandatory checks before starting your shift
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPreShiftChecklist({})}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {renderChecklistItems(preShiftItems, preShiftChecklist, 'pre')}
            </div>

            {/* Submit Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Ready to Start Shift?</h4>
                    <p className="text-sm text-gray-600">
                      Complete all mandatory checks before proceeding
                    </p>
                  </div>
                  <Button 
                    disabled={preShiftStats.percentage < 100}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Start Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="post-shift" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Post-Shift Safety Checklist</h3>
                <p className="text-sm text-gray-600">
                  Complete end-of-shift checks and equipment inspection
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setPostShiftChecklist({})}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button>
                  <Save className="w-4 h-4 mr-2" />
                  Save Progress
                </Button>
              </div>
            </div>

            <div className="space-y-6">
              {renderChecklistItems(postShiftItems, postShiftChecklist, 'post')}
            </div>

            {/* Submit Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">End Shift</h4>
                    <p className="text-sm text-gray-600">
                      Complete all checks to end your shift safely
                    </p>
                  </div>
                  <Button 
                    disabled={postShiftStats.percentage < 100}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    End Shift
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-blue-500" />
                  Safety Compliance History
                </CardTitle>
                <CardDescription>
                  Your safety checklist completion history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Mock history entries */}
                  {[
                    { date: '2024-01-15', preShift: 100, postShift: 100, issues: 0 },
                    { date: '2024-01-14', preShift: 100, postShift: 95, issues: 1 },
                    { date: '2024-01-13', preShift: 100, postShift: 100, issues: 0 },
                    { date: '2024-01-12', preShift: 95, postShift: 100, issues: 1 },
                    { date: '2024-01-11', preShift: 100, postShift: 100, issues: 0 },
                  ].map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{new Date(entry.date).toLocaleDateString()}</p>
                          <p className="text-sm text-gray-600">Shift Compliance</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-medium text-green-600">{entry.preShift}%</p>
                          <p className="text-gray-500">Pre-Shift</p>
                        </div>
                        <div className="text-center">
                          <p className="font-medium text-purple-600">{entry.postShift}%</p>
                          <p className="text-gray-500">Post-Shift</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center gap-1">
                            {entry.issues === 0 ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-orange-500" />
                            )}
                            <span className={entry.issues === 0 ? "text-green-600" : "text-orange-600"}>
                              {entry.issues} Issues
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Safety Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  Safety Tips & Reminders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <HardHat className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Personal Protective Equipment</p>
                        <p className="text-sm text-gray-600">Always wear your safety helmet, gloves, and high-visibility vest</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <EyeIcon className="h-5 w-5 text-blue-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Stay Alert</p>
                        <p className="text-sm text-gray-600">Be aware of traffic and surroundings at all times</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Truck className="h-5 w-5 text-green-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Vehicle Safety</p>
                        <p className="text-sm text-gray-600">Inspect vehicle before and after each shift</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium">Report Issues</p>
                        <p className="text-sm text-gray-600">Immediately report any safety concerns or equipment issues</p>
                      </div>
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