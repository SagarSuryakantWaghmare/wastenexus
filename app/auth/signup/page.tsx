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

export default function SignUpPage() {
    const router = useRouter();
    const { user, signup, isLoading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "client" as "client" | "champion",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isLoading && user) {
            if (user.role === "client") {
                router.push("/dashboard/client");
            } else {
                router.push("/dashboard/champion");
            }
        }
    }, [user, isLoading, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signup(formData.name, formData.email, formData.password, formData.role);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black/50">
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

            <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen relative z-10">
                <Card className="border border-white/30 shadow-2xl w-full max-w-md bg-white/10 backdrop-blur-2xl">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                <Leaf className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white">Waste Nexus</span>
                        </div>
                        <CardTitle className="text-3xl text-green-400 font-bold">Get Started</CardTitle>
                        <CardDescription className="text-white/70 text-base">
                            Create your account to start making a difference
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <Label htmlFor="name" className="text-white/90 font-semibold mb-2">Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-black/70 border border-white/30 text-white placeholder:text-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-black/80"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-white/90 font-semibold mb-2">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-black/70 border border-white/30 text-white placeholder:text-white/60 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-black/80"
                                />
                            </div>

                            {/* Password with Eye Toggle */}
                            <div className="relative">
                                <Label htmlFor="password" className="text-white font-semibold mb-2">Password</Label>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    minLength={6}
                                    className="bg-black/70 border border-white/40 text-white placeholder:text-white/60 focus:border-white/60 focus:bg-black/80 pr-10 h-12 rounded-md px-3 py-2"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-12 text-white/80"
                                    style={{ top: '50%' }}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>

                            <div>
                                <Label htmlFor="role" className="text-white/90 font-semibold mb-2">Select Your Role</Label>
                                <select
                                    id="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "client" | "champion" })}
                                    className="w-full bg-white/10 border border-white/30 text-white rounded-md px-3 py-2.5"
                                >
                                    <option value="client" className="bg-gray-900 text-white">Client - Report waste & earn rewards</option>
                                    <option value="champion" className="bg-gray-900 text-white">Champion - Verify reports & create events</option>
                                </select>
                            </div>

                            {error && (
                                <div className="rounded-lg bg-red-500/30 border border-red-400/50 p-3 text-sm text-white/90">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5"
                            >
                                {loading ? "Processing..." : "Sign Up"}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => router.push("/auth/signin")}
                                    className="text-sm text-white/80 hover:text-white"
                                >
                                    Already have an account? <span className="underline">Sign in</span>
                                </button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
