'use client'
import { useState, useCallback, useEffect } from 'react'
import {  MapPin, Upload, CheckCircle, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GoogleGenerativeAI } from "@google/generative-ai";
import { StandaloneSearchBox,  useJsApiLoader } from '@react-google-maps/api'
import { Libraries } from '@react-google-maps/api';
import { createUser, getUserByEmail, createReport, getRecentReports } from '@/utils/db/action';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast'

const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const libraries: Libraries = ['places'];

export default function ReportPage() {
  const [user, setUser] = useState<{ id: number; email: string; name: string } | null>(null);
  const router = useRouter();

  const [reports, setReports] = useState<Array<{
    id: number;
    location: string;
    wasteType: string;
    amount: string;
    createdAt: string;
  }>>([]);

  const [newReport, setNewReport] = useState({
    location: '',
    type: '',
    amount: '',
  })

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'verifying' | 'success' | 'failure'>('idle')
  const [verificationResult, setVerificationResult] = useState<{
    wasteType: string;
    quantity: string;
    confidence: number;
  } | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [searchBox, setSearchBox] = useState<google.maps.places.SearchBox | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: googleMapsApiKey!,
    libraries: libraries
  });

  const onLoad = useCallback((ref: google.maps.places.SearchBox) => {
    setSearchBox(ref);
  }, []);

  const onPlacesChanged = () => {
    if (searchBox) {
      const places = searchBox.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        setNewReport(prev => ({
          ...prev,
          location: place.formatted_address || '',
        }));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewReport({ ...newReport, [name]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const readFileAsBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleVerify = async () => {
    if (!file) return

    setVerificationStatus('verifying')
    
    try {
      const genAI = new GoogleGenerativeAI(geminiApiKey!);
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash"});

      const base64Data = await readFileAsBase64(file);

      const imageParts = [
        {
          inlineData: {
            data: base64Data.split(',')[1],
            mimeType: file.type,
          },
        },
      ];

      const prompt = `You are an expert in waste management and recycling. Analyze this image and provide:
        1. The type of waste (e.g., plastic, paper, glass, metal, organic)
        2. An estimate of the quantity or amount (in kg or liters)
        3. Your confidence level in this assessment (as a percentage)
        
        Respond in JSON format like this:
        {
          "wasteType": "type of waste",
          "quantity": "estimated quantity with unit",
          "confidence": confidence level as a number between 0 and 1
        }`;

      const result = await model.generateContent([prompt, ...imageParts]);
      const response = await result.response;
      const text = response.text();
      
      try {
        // Remove markdown code block backticks and whitespace
        const cleanedText = text.replace(/```json|```/g, '').trim();
        const parsedResult = JSON.parse(cleanedText);
        if (parsedResult.wasteType && parsedResult.quantity && parsedResult.confidence) {
          setVerificationResult(parsedResult);
          setVerificationStatus('success');
          setNewReport({
            ...newReport,
            type: parsedResult.wasteType,
            amount: parsedResult.quantity
          });
        } else {
          console.error('Invalid verification result:', parsedResult);
          setVerificationStatus('failure');
        }
      } catch (error) {
        console.error('Failed to parse JSON response:', text);
        setVerificationStatus('failure');
      }
    } catch (error) {
      console.error('Error verifying waste:', error);
      setVerificationStatus('failure');
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationStatus !== 'success' || !user) {
      toast.error('Please verify the waste before submitting or log in.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const report = await createReport(
        user.id,
        newReport.location,
        newReport.type,
        newReport.amount,
        preview || undefined,
        verificationResult ? JSON.stringify(verificationResult) : undefined
      ) as any;
      
      const formattedReport = {
        id: report.id,
        location: report.location,
        wasteType: report.wasteType,
        amount: report.amount,
        createdAt: report.createdAt.toISOString().split('T')[0]
      };
      
      setReports([formattedReport, ...reports]);
      setNewReport({ location: '', type: '', amount: '' });
      setFile(null);
      setPreview(null);
      setVerificationStatus('idle');
      setVerificationResult(null);
      

      toast.success(`Report submitted successfully! You've earned points for reporting waste.`);
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const email = localStorage.getItem('userEmail');
      if (email) {
        let user = await getUserByEmail(email);
        if (!user) {
          user = await createUser(email, 'Anonymous User');
        }
        setUser(user);
        
        const recentReports = await getRecentReports() || [];
        const formattedReports = recentReports.map(report => ({
          ...report,
          createdAt: report.createdAt?.toISOString ? report.createdAt.toISOString().split('T')[0] : report.createdAt
        }));
        setReports(formattedReports);
      } else {
        router.push('/login'); 
      }
    };
    checkUser();
  }, [router]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Report Waste</h1>
        <p className="text-gray-600">Help keep our environment clean by reporting waste locations</p>
      </div>
      
      {/* Report Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 md:p-8 rounded-xl mb-12">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Submit New Report</h2>
        
        {/* Image Upload Section */}
        <div className="mb-6">
          <label htmlFor="waste-image" className="block text-sm font-medium text-gray-700 mb-3">
            Waste Image *
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-green-500 transition-colors duration-200 cursor-pointer">
            <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
            <label
              htmlFor="waste-image"
              className="cursor-pointer text-green-600 hover:text-green-700 font-medium"
            >
              Choose file
            </label>
            <span className="text-gray-500"> or drag and drop</span>
            <input 
              id="waste-image" 
              name="waste-image" 
              type="file" 
              className="hidden" 
              onChange={handleFileChange} 
              accept="image/*" 
            />
            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        
        {/* Image Preview */}
        {preview && (
          <div className="mb-6 rounded-lg overflow-hidden border border-gray-200">
            <img src={preview} alt="Waste preview" className="w-full h-auto max-h-96 object-cover" />
          </div>
        )}
        
        {/* Verify Button */}
        <Button 
          type="button" 
          onClick={handleVerify} 
          className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium" 
          disabled={!file || verificationStatus === 'verifying'}
        >
          {verificationStatus === 'verifying' ? (
            <>
              <Loader className="animate-spin mr-2 h-5 w-5" />
              Analyzing Image...
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 h-5 w-5" />
              Verify Waste
            </>
          )}
        </Button>

        {/* Verification Success */}
        {verificationStatus === 'success' && verificationResult && (
          <div className="bg-green-50 border border-green-200 p-5 mb-6 rounded-lg">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-base font-semibold text-green-900 mb-2">Verification Successful</h3>
                <div className="text-sm text-green-800 space-y-1">
                  <p><span className="font-medium">Type:</span> {verificationResult.wasteType}</p>
                  <p><span className="font-medium">Quantity:</span> {verificationResult.quantity}</p>
                  <p><span className="font-medium">Confidence:</span> {(verificationResult.confidence * 100).toFixed(0)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Location *
            </label>
            {isLoaded ? (
              <StandaloneSearchBox
                onLoad={onLoad}
                onPlacesChanged={onPlacesChanged}
              >
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={newReport.location}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Enter waste location"
                />
              </StandaloneSearchBox>
            ) : (
              <input
                type="text"
                id="location"
                name="location"
                value={newReport.location}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter waste location"
              />
            )}
          </div>
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              Waste Type *
            </label>
            <input
              type="text"
              id="type"
              name="type"
              value={newReport.type}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              placeholder="Auto-filled after verification"
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
              Estimated Amount *
            </label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={newReport.amount}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
              placeholder="Auto-filled after verification"
              readOnly
            />
          </div>
        </div>
        
        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium"
          disabled={isSubmitting || verificationStatus !== 'success'}
        >
          {isSubmitting ? (
            <>
              <Loader className="animate-spin mr-2 h-5 w-5" />
              Submitting Report...
            </>
          ) : 'Submit Report'}
        </Button>
      </form>

      {/* Recent Reports Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reports</h2>
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span className="truncate">{report.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{report.wasteType}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{report.amount}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{report.createdAt}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      No reports yet. Submit your first report above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}