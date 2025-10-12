'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Leaf, 
  TrendingUp, 
  Gift,
  Calendar,
  BookOpen,
  Camera,
  Recycle,
  TreePine,
  ShoppingCart,
  Star,
  Target,
  Clock,
  CheckCircle
} from "lucide-react";
import { mockGreenCredits, mockUser } from "@/data/mockData";

interface RedemptionOption {
  id: string;
  title: string;
  description: string;
  cost: number;
  category: 'products' | 'vouchers' | 'donations' | 'services';
  icon: React.ComponentType<{ className?: string }>;
  available: boolean;
  image?: string;
}

export default function CreditsPage() {
  const [activeTab, setActiveTab] = useState('overview');

  const redemptionOptions: RedemptionOption[] = [
    {
      id: 'eco-bag',
      title: 'Eco-Friendly Tote Bag',
      description: 'Reusable cotton bag for sustainable shopping',
      cost: 50,
      category: 'products',
      icon: ShoppingCart,
      available: true
    },
    {
      id: 'plant-sapling',
      title: 'Plant a Tree',
      description: 'Sponsor a tree plantation in your city',
      cost: 100,
      category: 'donations',
      icon: TreePine,
      available: true
    },
    {
      id: 'compost-bin',
      title: 'Home Composting Kit',
      description: 'Complete kit for organic waste composting',
      cost: 150,
      category: 'products',
      icon: Recycle,
      available: true
    },
    {
      id: 'cleaning-drive',
      title: 'Community Clean-up Sponsorship',
      description: 'Fund cleaning supplies for community drives',
      cost: 200,
      category: 'services',
      icon: Target,
      available: true
    },
    {
      id: 'amazon-voucher',
      title: 'Amazon Gift Voucher',
      description: '₹500 voucher for eco-friendly products',
      cost: 300,
      category: 'vouchers',
      icon: Gift,
      available: mockUser.greenCredits >= 300
    },
    {
      id: 'solar-light',
      title: 'Solar Garden Light',
      description: 'LED solar-powered garden light',
      cost: 250,
      category: 'products',
      icon: Star,
      available: mockUser.greenCredits >= 250
    }
  ];

  const creditSources = [
    { type: 'training', label: 'Training Completion', icon: BookOpen, color: 'text-blue-500' },
    { type: 'reporting', label: 'Waste Reporting', icon: Camera, color: 'text-orange-500' },
    { type: 'segregation', label: 'Proper Segregation', icon: Recycle, color: 'text-green-500' },
    { type: 'collection', label: 'Waste Collection', icon: TreePine, color: 'text-purple-500' }
  ];

  const getSourceStats = () => {
    const stats = creditSources.map(source => {
      const credits = mockGreenCredits.filter(c => c.source === source.type && c.type === 'earned');
      const total = credits.reduce((sum, c) => sum + c.amount, 0);
      return {
        ...source,
        total,
        count: credits.length
      };
    });
    return stats;
  };

  const totalEarned = mockGreenCredits
    .filter(c => c.type === 'earned')
    .reduce((sum, c) => sum + c.amount, 0);
  
  const totalRedeemed = Math.abs(mockGreenCredits
    .filter(c => c.type === 'redeemed')
    .reduce((sum, c) => sum + c.amount, 0));

  const monthlyData = [
    { month: 'Jan', earned: 45, redeemed: 20 },
    { month: 'Feb', earned: 52, redeemed: 15 },
    { month: 'Mar', earned: 38, redeemed: 30 },
    { month: 'Apr', earned: 65, redeemed: 25 },
    { month: 'May', earned: 58, redeemed: 40 },
    { month: 'Jun', earned: 70, redeemed: 35 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Green Credits</h1>
            <p className="text-gray-600 mt-2">Earn and redeem credits for sustainable actions</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{mockUser.greenCredits}</div>
              <div className="text-sm text-gray-500">Current Balance</div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{totalEarned}</div>
              <p className="text-xs text-gray-500">All time earnings</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Redeemed</CardTitle>
              <Gift className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{totalRedeemed}</div>
              <p className="text-xs text-gray-500">Successfully redeemed</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                +{monthlyData[monthlyData.length - 1]?.earned || 0}
              </div>
              <p className="text-xs text-gray-500">Credits earned</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Milestone</CardTitle>
              <Target className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">500</div>
              <p className="text-xs text-gray-500">
                {500 - mockUser.greenCredits} credits to go
              </p>
              <Progress 
                value={(mockUser.greenCredits / 500) * 100} 
                className="h-2 mt-2" 
              />
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earn">Earn Credits</TabsTrigger>
            <TabsTrigger value="redeem">Redeem</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Credit Sources Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Credits by Source</CardTitle>
                  <CardDescription>How you&apos;ve earned your credits</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getSourceStats().map((source) => (
                    <div key={source.type} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <source.icon className={`h-4 w-4 ${source.color}`} />
                          <span className="text-sm font-medium">{source.label}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-bold">{source.total}</span>
                          <span className="text-xs text-gray-500 ml-1">
                            ({source.count} actions)
                          </span>
                        </div>
                      </div>
                      <Progress 
                        value={(source.total / totalEarned) * 100} 
                        className="h-2" 
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Monthly Trend */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Trend</CardTitle>
                  <CardDescription>Credits earned vs redeemed over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.slice(-3).map((data) => (
                      <div key={data.month} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{data.month}</span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-green-600">+{data.earned}</span>
                            <span className="text-orange-600">-{data.redeemed}</span>
                          </div>
                        </div>
                        <div className="flex gap-1 h-2 bg-gray-100 rounded">
                          <div 
                            className="bg-green-500 rounded-l"
                            style={{ width: `${(data.earned / (data.earned + data.redeemed)) * 100}%` }}
                          />
                          <div 
                            className="bg-orange-500 rounded-r"
                            style={{ width: `${(data.redeemed / (data.earned + data.redeemed)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest credit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGreenCredits.slice(0, 5).map((credit) => {
                    const source = creditSources.find(s => s.type === credit.source);
                    return (
                      <div key={credit.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-full ${
                            credit.type === 'earned' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {source ? (
                              <source.icon className={`h-3 w-3 ${source.color}`} />
                            ) : (
                              <Gift className="h-3 w-3 text-orange-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{credit.description}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {new Date(credit.date).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`font-bold ${
                          credit.type === 'earned' ? 'text-green-600' : 'text-orange-600'
                        }`}>
                          {credit.type === 'earned' ? '+' : ''}{credit.amount}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earn" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Ways to Earn Credits</CardTitle>
                <CardDescription>Complete these actions to earn green credits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {creditSources.map((source) => (
                    <div key={source.type} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <source.icon className={`h-5 w-5 ${source.color}`} />
                        </div>
                        <h3 className="font-semibold">{source.label}</h3>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        {source.type === 'training' && (
                          <div>
                            <p>• Complete training modules: <strong>25-50 credits</strong></p>
                            <p>• Pass assessments: <strong>10-25 credits</strong></p>
                            <p>• Earn certificates: <strong>50 credits</strong></p>
                          </div>
                        )}
                        {source.type === 'reporting' && (
                          <div>
                            <p>• Report waste issues: <strong>15-30 credits</strong></p>
                            <p>• Provide accurate details: <strong>5-10 credits</strong></p>
                            <p>• Upload clear photos: <strong>5 credits</strong></p>
                          </div>
                        )}
                        {source.type === 'segregation' && (
                          <div>
                            <p>• Perfect weekly segregation: <strong>20-40 credits</strong></p>
                            <p>• Consistent daily habits: <strong>5-10 credits</strong></p>
                            <p>• Help neighbors segregate: <strong>15 credits</strong></p>
                          </div>
                        )}
                        {source.type === 'collection' && (
                          <div>
                            <p>• Participate in clean-up drives: <strong>30-50 credits</strong></p>
                            <p>• Organize community events: <strong>100 credits</strong></p>
                            <p>• Volunteer regularly: <strong>25 credits</strong></p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="redeem" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Redeem Your Credits</CardTitle>
                <CardDescription>
                  You have {mockUser.greenCredits} credits available to redeem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {redemptionOptions.map((option) => (
                    <Card key={option.id} className={`hover:shadow-lg transition-shadow ${
                      !option.available ? 'opacity-50' : ''
                    }`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <option.icon className="h-5 w-5 text-green-500" />
                            <CardTitle className="text-lg">{option.title}</CardTitle>
                          </div>
                          <Badge variant={option.available ? 'default' : 'secondary'}>
                            {option.cost} credits
                          </Badge>
                        </div>
                        <CardDescription>{option.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Button 
                          className="w-full" 
                          disabled={!option.available}
                          variant={option.available ? 'default' : 'outline'}
                        >
                          {option.available ? 'Redeem Now' : 'Insufficient Credits'}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Complete history of your credit transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockGreenCredits.map((credit) => {
                    const source = creditSources.find(s => s.type === credit.source);
                    return (
                      <div key={credit.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-full ${
                            credit.type === 'earned' ? 'bg-green-100' : 'bg-orange-100'
                          }`}>
                            {credit.type === 'earned' ? (
                              source ? (
                                <source.icon className={`h-4 w-4 ${source.color}`} />
                              ) : (
                                <Leaf className="h-4 w-4 text-green-500" />
                              )
                            ) : (
                              <Gift className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{credit.description}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-gray-400" />
                                <span className="text-sm text-gray-500">
                                  {new Date(credit.date).toLocaleDateString()}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {credit.source}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`text-lg font-bold ${
                            credit.type === 'earned' ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {credit.type === 'earned' ? '+' : ''}{credit.amount}
                          </span>
                          <div className="flex items-center gap-1 mt-1">
                            {credit.type === 'earned' ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <Gift className="w-3 h-3 text-orange-500" />
                            )}
                            <span className="text-xs text-gray-500 capitalize">
                              {credit.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}