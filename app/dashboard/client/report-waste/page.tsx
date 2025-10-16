"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { WasteReportForm } from "@/components/WasteReportForm";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { formatDate } from "@/lib/helpers";

export default function ReportWastePage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [reports, setReports] = useState<any[]>([]); // eslint-disable-line
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/");
    } else if (user && user.role !== "client") {
      router.push("/dashboard/champion");
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchReports();
    }
    // eslint-disable-next-line
  }, [user]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data.reports);
    } catch (error) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <span className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-green-400 border-t-transparent"></span>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 py-10">
        <section className="w-full max-w-6xl bg-white rounded-2xl shadow-lg p-6 sm:p-10 border border-green-100 flex flex-col justify-center min-h-[480px]">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 mb-2 text-center">Report Waste</h1>
          <p className="text-gray-500 text-center mb-6">Submit a new waste report and help keep your community clean!</p>
          <WasteReportForm onSuccess={fetchReports} />
        </section>
      </main>
    </div>
  );
}
