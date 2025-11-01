"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import { PageLoader, LoaderCircle } from "@/components/ui/loader";
import { toast } from "sonner";

export default function SignUpPage() {
    const router = useRouter();
    const { user, signup, isLoading } = useAuth();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "client" as "client" | "champion" | "worker" | "admin",
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
            await signup(formData.name, formData.email, formData.password, formData.role);
            toast.success("Account created successfully!");
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black/50">
                <PageLoader message="Authenticating..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 -z-10">
                <Image src="/assets/authbg.jpg" alt="Background" fill className="object-cover" />
            </div>

            <div className="container mx-auto px-4 min-h-screen flex items-center justify-center relative z-10">
                <Card className="border-2 border-green-500/30 shadow-2xl w-full max-w-[420px] bg-white/95 dark:bg-gray-900/90 backdrop-blur-xl">
                    <CardHeader className="pb-4 space-y-2">
                        <div className="flex items-center gap-2 mb-1">
                            <div className="p-1.5 bg-green-500/30 dark:bg-green-500/20 rounded-lg backdrop-blur-sm border border-green-500/30">
                                <Image 
                                  src="/assets/logo/recycle-symbol.png" 
                                  alt="WasteNexus Logo" 
                                  width={20} 
                                  height={20}
                                  className="h-5 w-5 object-contain"
                                />
                            </div>
                            <span className="text-lg font-bold text-gray-900 dark:text-white drop-shadow-lg">Waste Nexus</span>
                        </div>
                        <CardTitle className="text-2xl text-gray-900 dark:text-white font-bold drop-shadow-md">Get Started</CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-200 text-sm drop-shadow">
                            Create your account to start making a difference
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="pt-4">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="name" className="text-gray-800 dark:text-white font-semibold text-sm drop-shadow">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-gray-100 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="email" className="text-gray-800 dark:text-white font-semibold text-sm drop-shadow">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-gray-100 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label htmlFor="password" className="text-gray-800 dark:text-white font-semibold text-sm drop-shadow">Password</Label>
                                <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Minimum 6 characters"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="bg-gray-100 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 h-10 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <Label htmlFor="role" className="text-gray-800 dark:text-white font-semibold text-sm drop-shadow">Select Your Role</Label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "client" | "champion" | "worker" | "admin" })}
                                    className="w-full bg-gray-100 dark:bg-gray-800/80 border-2 border-gray-300 dark:border-gray-600/50 text-gray-900 dark:text-white rounded-lg px-3 py-2 h-10 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all cursor-pointer"
                                >
                                    <option value="client" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Client - Report waste & earn rewards</option>
                                    <option value="champion" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">Champion - Verify reports & create events</option>
                                </select>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-100 dark:bg-red-500/20 border-2 border-red-300 dark:border-red-400/50 p-3 text-sm text-red-800 dark:text-white font-medium shadow-lg">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2.5 h-11 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-[1.02]"
                            >
                                {loading && <LoaderCircle size="sm" className="mr-2" />}
                                {loading ? "Creating account..." : "Sign Up"}
                            </Button>

                            <div className="text-center pt-1 space-y-2">
                                <button
                                    type="button"
                                    onClick={() => router.push("/auth/signin")}
                                    className="block w-full text-sm text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                                >
                                    Already have an account? <span className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline">Sign in</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push("/")}
                                    className="block w-full text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                >
                                    ← Return to Home
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
