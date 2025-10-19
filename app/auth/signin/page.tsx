"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Eye, EyeOff } from "lucide-react";
import Image from "next/image";

export default function SignInPage() {
  const router = useRouter();
  const { user, login, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      // Redirect based on user role
      switch (user.role) {
        case "client":
          router.push("/dashboard/client");
          break;
        case "worker":
          router.push("/dashboard/worker");
          break;
        case "admin":
          router.push("/dashboard/admin");
          break;
        case "champion":
          router.push("/dashboard/champion");
          break;
        default:
          router.push("/dashboard/client");
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(formData.email, formData.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900/50">
        <div className="text-center">
          <Leaf className="h-12 w-12 animate-pulse text-green-400 mx-auto" />
          <p className="mt-2 text-green-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <Image src="/assets/authbg.jpg" alt="Background" fill className="object-cover" />
      </div>

      <div className="container mx-auto px-4 min-h-screen flex items-center justify-center relative z-10">
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-2xl border border-green-200 shadow-xl">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Leaf className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-xl font-bold text-white">Waste Nexus</span>
            </div>
            <CardTitle className="text-2xl text-white font-bold">Welcome Back</CardTitle>
            <CardDescription className="text-white/80">Sign in to continue your journey</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="email" className="text-white font-semibold mb-2 block">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="bg-gray-900/60 border border-gray-700 text-white placeholder:text-white/50 rounded-md px-3 py-1.5 h-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-900/70"
                />
              </div>
              <div>
                <Label htmlFor="password" className="text-white font-semibold mb-2">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter a strong password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="bg-gray-900/60 border border-gray-700 text-white placeholder:text-white/50 h-10 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-gray-900/70"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute inset-y-0 right-2 flex items-center pr-2 text-white/70"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && (
                <div className="rounded-lg bg-red-200 border border-red-400 p-3 text-sm text-red-800">{error}</div>
              )}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 rounded-md"
              >
                {loading ? "Processing..." : "Sign In"}
              </Button>
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => router.push("/auth/signup")}
                  className="text-sm text-white hover:text-white hover:underline"
                >
                  Don&apos;t have an account? Sign up
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
