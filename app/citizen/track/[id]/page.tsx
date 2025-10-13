"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, MapPin, Recycle, Check, Leaf, Droplet } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function TrackWastePage() {
  const params = useParams();
  const [report, setReport] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      loadReport(params.id as string);
    }
  }, [params.id]);

  const loadReport = async (id: string) => {
    try {
      const response = await fetch(`/api/reports/track/${id}`);
      if (response.ok) {
        const data = await response.json();
        setReport(data.report);
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Failed to load report:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Report not found</p>
          <Button asChild>
            <Link href="/citizen">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: 'pending', label: 'Reported', icon: MapPin, color: 'text-orange-600' },
    { key: 'assigned', label: 'Assigned', icon: Check, color: 'text-blue-600' },
    { key: 'collected', label: 'Collected', icon: Recycle, color: 'text-green-600' },
    { key: 'segregated', label: 'Segregated', icon: Check, color: 'text-teal-600' },
    { key: 'recycled', label: 'Recycled', icon: Leaf, color: 'text-emerald-600' },
  ];

  const currentStepIndex = statusSteps.findIndex(s => s.key === report.status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button asChild variant="outline">
          <Link href="/citizen">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Track Waste Journey 🚛</h1>
          <p className="text-gray-600">Follow your waste from report to recycling</p>
        </div>

        {/* Journey Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Waste Journey Progress</CardTitle>
            <CardDescription>Current status: <strong>{report.status}</strong></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <p className="text-sm text-gray-600 text-right">{progress.toFixed(0)}% complete</p>
            </div>

            {/* Status Timeline */}
            <div className="space-y-4">
              {statusSteps.map((step, index) => {
                const isCompleted = index <= currentStepIndex;
                const isCurrent = index === currentStepIndex;
                
                return (
                  <div key={step.key} className={`flex items-start gap-4 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`p-3 rounded-full ${isCompleted ? 'bg-green-100' : 'bg-gray-100'}`}>
                      <step.icon className={`h-6 w-6 ${isCompleted ? step.color : 'text-gray-400'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-lg">{step.label}</h4>
                        {isCompleted && (
                          <Badge className="bg-green-600">
                            <Check className="h-3 w-3 mr-1" />
                            {isCurrent ? 'Current' : 'Complete'}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {step.key === 'pending' && "Your waste report has been submitted"}
                        {step.key === 'assigned' && "Waste collection team has been assigned"}
                        {step.key === 'collected' && "Waste has been collected from location"}
                        {step.key === 'segregated' && "Waste has been properly segregated"}
                        {step.key === 'recycled' && "Waste has been recycled successfully"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Report Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Waste Type</p>
                <p className="font-semibold capitalize">{report.wasteType}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Amount</p>
                <p className="font-semibold">{report.amount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold">{report.location.address}</p>
              </div>
              {report.recyclingPlant && (
                <div>
                  <p className="text-sm text-gray-600">Recycling Plant</p>
                  <p className="font-semibold">{report.recyclingPlant}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Points Earned</p>
                <p className="font-semibold text-green-600">+{report.points} 🌿</p>
              </div>
            </CardContent>
          </Card>

          {/* Environmental Impact */}
          {report.impact && (
            <Card className="bg-gradient-to-br from-green-600 to-emerald-600 text-white">
              <CardHeader>
                <CardTitle>Environmental Impact 🌍</CardTitle>
                <CardDescription className="text-green-100">Your contribution to the planet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-8 w-8" />
                    <div>
                      <p className="text-sm opacity-90">CO₂ Saved</p>
                      <p className="text-2xl font-bold">{report.impact.co2Saved} kg</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Leaf className="h-8 w-8" />
                    <div>
                      <p className="text-sm opacity-90">Trees Equivalent</p>
                      <p className="text-2xl font-bold">{report.impact.treesEquivalent}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Droplet className="h-8 w-8" />
                    <div>
                      <p className="text-sm opacity-90">Water Saved</p>
                      <p className="text-2xl font-bold">{report.impact.waterSaved} L</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
