import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  BookOpen, 
  Camera, 
  Leaf, 
  Award, 
  TrendingUp, 
  MapPin, 
  Clock,
  Users,
  Target,
  Recycle,
  TreePine
} from "lucide-react";
import Link from "next/link";
import { mockUser, mockTrainingModules, mockWasteReports, mockGreenCredits } from "@/data/mockData";

export default function CitizenDashboard() {
  const recentActivity = [
    {
      id: 1,
      type: 'training',
      title: 'Completed Waste Segregation Module',
      time: '2 hours ago',
      icon: BookOpen,
      color: 'text-blue-500'
    },
    {
      id: 2,
      type: 'report',
      title: 'Reported waste issue at MG Road',
      time: '1 day ago',
      icon: Camera,
      color: 'text-orange-500'
    },
    {
      id: 3,
      type: 'credits',
      title: 'Earned 25 Green Credits',
      time: '2 days ago',
      icon: Leaf,
      color: 'text-green-500'
    }
  ];

  const quickStats = [
    {
      title: "Training Progress",
      value: `${mockUser.trainingProgress}%`,
      icon: BookOpen,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      description: "Course completion"
    },
    {
      title: "Green Credits",
      value: mockUser.greenCredits.toLocaleString(),
      icon: Leaf,
      color: "text-green-500",
      bgColor: "bg-green-50",
      description: "Total credits earned"
    },
    {
      title: "Certificates",
      value: mockUser.certificatesEarned,
      icon: Award,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
      description: "Achievements unlocked"
    },
    {
      title: "Reports Submitted",
      value: mockWasteReports.length,
      icon: Camera,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Community contributions"
    }
  ];

  const inProgressTraining = mockTrainingModules.filter(module => module.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/avatars/citizen.jpg" alt={mockUser.name} />
              <AvatarFallback className="text-lg font-semibold bg-green-100 text-green-700">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, {mockUser.name.split(' ')[0]}!</h1>
              <p className="text-gray-600">Let&apos;s make a difference together</p>
              <Badge variant="secondary" className="mt-1">
                <Users className="w-3 h-3 mr-1" />
                {mockUser.role.charAt(0).toUpperCase() + mockUser.role.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/citizen/report">
                <Camera className="w-4 h-4 mr-2" />
                Report Waste
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/citizen/training">
                <BookOpen className="w-4 h-4 mr-2" />
                Continue Training
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="impact">Impact</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* In Progress Training */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-500" />
                    Continue Learning
                  </CardTitle>
                  <CardDescription>Pick up where you left off</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inProgressTraining.length > 0 ? (
                    inProgressTraining.map((module) => (
                      <div key={module.id} className="space-y-3 p-4 bg-blue-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{module.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          </div>
                          <Badge variant="outline">{module.difficulty}</Badge>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <Progress value={module.progress} className="h-2" />
                        </div>
                        <Button asChild size="sm" className="w-full">
                          <Link href={`/citizen/training/${module.id}`}>Continue</Link>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">All training modules completed!</p>
                      <Button asChild variant="outline" className="mt-4">
                        <Link href="/citizen/training">Explore More</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Reports */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5 text-orange-500" />
                    Your Reports
                  </CardTitle>
                  <CardDescription>Track your waste reports</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockWasteReports.slice(0, 3).map((report) => (
                    <div key={report.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {report.location.address}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant={
                              report.status === 'collected' ? 'default' : 
                              report.status === 'assigned' ? 'secondary' : 'outline'
                            }
                            className="text-xs"
                          >
                            {report.status.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(report.reportedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <MapPin className="h-4 w-4 text-gray-400" />
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/citizen/report">View All Reports</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Training Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Training Journey</CardTitle>
                  <CardDescription>Your learning progress across all modules</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockTrainingModules.map((module) => (
                    <div key={module.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">{module.title}</span>
                        <Badge variant={
                          module.status === 'completed' ? 'default' :
                          module.status === 'in_progress' ? 'secondary' : 'outline'
                        }>
                          {module.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <Progress value={module.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Credits Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Green Credits History</CardTitle>
                  <CardDescription>Recent credits earned and redeemed</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockGreenCredits.slice(0, 5).map((credit) => (
                    <div key={credit.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${
                          credit.type === 'earned' ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          <Leaf className={`h-3 w-3 ${
                            credit.type === 'earned' ? 'text-green-600' : 'text-red-600'
                          }`} />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{credit.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(credit.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`font-medium ${
                        credit.type === 'earned' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {credit.type === 'earned' ? '+' : ''}{credit.amount}
                      </span>
                    </div>
                  ))}
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/citizen/credits">View All Credits</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest actions and achievements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-full bg-white`}>
                      <activity.icon className={`h-4 w-4 ${activity.color}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="impact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">245 kg</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Waste Diverted</CardTitle>
                  <Recycle className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89 kg</div>
                  <p className="text-xs text-muted-foreground">From landfills</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Trees Planted</CardTitle>
                  <TreePine className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Through credit exchange</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Community Rank</CardTitle>
                  <Target className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">#42</div>
                  <p className="text-xs text-muted-foreground">Out of 15,420 citizens</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and helpful links</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/citizen/training">
                  <BookOpen className="h-6 w-6 mb-2" />
                  <span className="text-sm">Start Training</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/citizen/report">
                  <Camera className="h-6 w-6 mb-2" />
                  <span className="text-sm">Report Issue</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/citizen/certificates">
                  <Award className="h-6 w-6 mb-2" />
                  <span className="text-sm">My Certificates</span>
                </Link>
              </Button>
              <Button asChild variant="outline" className="h-auto p-4 flex-col">
                <Link href="/citizen/profile">
                  <Users className="h-6 w-6 mb-2" />
                  <span className="text-sm">View Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}