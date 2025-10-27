"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { WasteReportForm } from "@/components/WasteReportForm";
import { Navbar } from "@/components/Navbar";
import { BackButton } from "@/components/ui/back-button";
import { LoaderOne } from "@/components/ui/loader";

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
  }, [user]);

  const fetchReports = async () => {
    try {
      const res = await fetch("/api/reports");
      const data = await res.json();
      setReports(data.reports);
    } catch {
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        <div className="text-center">
          <LoaderOne />
          <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading report form...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex flex-col transition-colors duration-300">
      <Navbar />
      <main className="flex-1 flex flex-col items-center w-full px-2 sm:px-4 py-10">
        <section className="w-full max-w-6xl">
          <BackButton href="/dashboard/client" label="Back to Dashboard" />
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-10 border border-green-100 dark:border-gray-700 transition-colors duration-300">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-green-700 dark:text-green-400 mb-2 text-center">Report Waste</h1>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-6">Submit a new waste report and help keep your community clean!</p>
            <WasteReportForm onSuccess={fetchReports} />
          </div>
        </section>
      </main>
    </div>
  );
}
