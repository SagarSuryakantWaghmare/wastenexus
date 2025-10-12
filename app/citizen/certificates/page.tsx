'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Award, 
  Download, 
  Share2,
  Search,
  Calendar,
  Star,
  CheckCircle,
  ExternalLink,
  Copy,
  Trophy,
  BookOpen,
  Shield,
  Verified,
  Target
} from "lucide-react";
import { mockCertificates, mockTrainingModules } from "@/data/mockData";

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredCertificates = mockCertificates.filter(cert => {
    const matchesSearch = cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'recent') {
      const isRecent = new Date(cert.issuedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      return matchesSearch && isRecent;
    }
    if (selectedFilter === 'high-score') {
      return matchesSearch && cert.score >= 90;
    }
    
    return matchesSearch;
  });

  const averageScore = mockCertificates.reduce((sum, cert) => sum + cert.score, 0) / mockCertificates.length;

  const handleDownload = (cert: typeof mockCertificates[0]) => {
    // In a real app, this would trigger a download
    console.log('Downloading certificate:', cert.id);
  };

  const handleShare = (cert: typeof mockCertificates[0]) => {
    // In a real app, this would open a share dialog
    navigator.clipboard.writeText(cert.shareUrl);
    console.log('Certificate link copied to clipboard');
  };

  const handleVerify = (cert: typeof mockCertificates[0]) => {
    // In a real app, this would open verification page
    console.log('Verifying certificate:', cert.verificationId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
            <p className="text-gray-600 mt-2">Your achievements and qualifications in waste management</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              <Trophy className="w-3 h-3 mr-1" />
              {mockCertificates.length} Certificates Earned
            </Badge>
            <Badge variant="outline" className="text-sm">
              Avg Score: {Math.round(averageScore)}%
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Certificates</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockCertificates.length}</div>
              <p className="text-xs text-gray-500">Achievements unlocked</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Highest Score</CardTitle>
              <Star className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.max(...mockCertificates.map(c => c.score))}%
              </div>
              <p className="text-xs text-gray-500">Best performance</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Achievements</CardTitle>
              <Calendar className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockCertificates.filter(cert => 
                  new Date(cert.issuedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                ).length}
              </div>
              <p className="text-xs text-gray-500">This month</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round((mockCertificates.length / mockTrainingModules.length) * 100)}%
              </div>
              <p className="text-xs text-gray-500">Modules completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Certificates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search certificates by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  variant={selectedFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={selectedFilter === 'recent' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('recent')}
                >
                  Recent
                </Button>
                <Button 
                  variant={selectedFilter === 'high-score' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setSelectedFilter('high-score')}
                >
                  High Score
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Certificates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCertificates.map((certificate) => {
            const relatedModule = mockTrainingModules.find(m => m.id === certificate.moduleId);
            
            return (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow duration-300 relative overflow-hidden">
                {/* Certificate Header Design */}
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 w-full" />
                
                <CardHeader className="relative">
                  {/* Verification Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <Verified className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Award className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg pr-20">{certificate.title}</CardTitle>
                      <CardDescription className="mt-2">{certificate.description}</CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-4">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      {certificate.score}% Score
                    </Badge>
                    {relatedModule && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        {relatedModule.category}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Certificate Details */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Issued Date
                      </span>
                      <span className="font-medium">
                        {new Date(certificate.issuedDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Certificate ID
                      </span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {certificate.verificationId}
                      </span>
                    </div>
                    
                    {certificate.blockchainHash && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Blockchain
                        </span>
                        <span className="text-green-600 text-xs">Secured</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(certificate)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleShare(certificate)}
                      className="flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      Share
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleVerify(certificate)}
                      className="flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Verify
                    </Button>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="pt-3 border-t border-gray-100">
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      <span>Quick Actions:</span>
                      <div className="flex gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => navigator.clipboard.writeText(certificate.verificationId)}
                          className="h-6 px-2 text-xs"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => window.open(certificate.shareUrl, '_blank')}
                          className="h-6 px-2 text-xs"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredCertificates.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedFilter !== 'all' 
                  ? 'Try adjusting your search terms or filters'
                  : 'Complete training modules to earn your first certificate'
                }
              </p>
              <div className="flex gap-4 justify-center">
                {(searchTerm || selectedFilter !== 'all') && (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
                <Button asChild>
                  <a href="/citizen/training">Start Training</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Certificate Verification Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Certificate Verification
            </CardTitle>
            <CardDescription>
              All certificates are digitally signed and can be independently verified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 bg-blue-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <Verified className="h-6 w-6 text-blue-600" />
                </div>
                <h4 className="font-medium mb-2">Digital Signature</h4>
                <p className="text-sm text-gray-600">
                  Each certificate is cryptographically signed to prevent tampering
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-green-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-medium mb-2">Blockchain Secured</h4>
                <p className="text-sm text-gray-600">
                  Certificate hashes are stored on blockchain for immutable verification
                </p>
              </div>
              
              <div className="text-center">
                <div className="p-3 bg-purple-100 rounded-full w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                  <ExternalLink className="h-6 w-6 text-purple-600" />
                </div>
                <h4 className="font-medium mb-2">Public Verification</h4>
                <p className="text-sm text-gray-600">
                  Anyone can verify certificate authenticity using the verification ID
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        {mockCertificates.length < mockTrainingModules.length && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-500" />
                Earn More Certificates
              </CardTitle>
              <CardDescription>
                Complete these training modules to earn additional certificates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockTrainingModules
                  .filter(module => !mockCertificates.some(cert => cert.moduleId === module.id))
                  .slice(0, 3)
                  .map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{module.title}</h4>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                    <Button asChild size="sm">
                      <a href={`/citizen/training/${module.id}`}>
                        {module.status === 'not_started' ? 'Start' : 'Continue'}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}