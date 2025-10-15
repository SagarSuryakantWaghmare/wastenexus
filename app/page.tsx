'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Award, TrendingUp } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { user, login, signup, isLoading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client' as 'client' | 'champion',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === 'client') {
        router.push('/dashboard/client');
      } else {
        router.push('/dashboard/champion');
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await signup(formData.name, formData.email, formData.password, formData.role);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-green-50">
        <div className="text-center">
          <Leaf className="h-12 w-12 animate-pulse text-green-600 mx-auto" />
          <p className="mt-2 text-green-700">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Leaf className="h-12 w-12 text-green-600" />
              <h1 className="text-5xl font-bold text-green-700">Waste Nexus</h1>
            </div>
            
            <p className="text-xl text-gray-700 mb-8">
              Transform waste management into a rewarding experience. Join the sustainable revolution today!
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700">Earn Rewards</h3>
                  <p className="text-gray-600">Get points for every verified waste report</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700">Climb the Leaderboard</h3>
                  <p className="text-gray-600">Compete with others and track your progress</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-green-100 p-2">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-700">Join Events</h3>
                  <p className="text-gray-600">Participate in community campaigns</p>
                </div>
              </div>
            </div>
          </div>

          <Card className="border-green-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-green-700">
                {isLogin ? 'Welcome Back' : 'Get Started'}
              </CardTitle>
              <CardDescription>
                {isLogin ? 'Sign in to continue your journey' : 'Create your account to start making a difference'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required={!isLogin}
                      className="border-green-200 focus:border-green-500"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="border-green-200 focus:border-green-500"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    minLength={6}
                    className="border-green-200 focus:border-green-500"
                  />
                </div>

                {!isLogin && (
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as 'client' | 'champion' })}
                      className="w-full rounded-md border border-green-200 px-3 py-2 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="client">Client - Report waste & earn rewards</option>
                      <option value="champion">Champion - Verify reports & create events</option>
                    </select>
                  </div>
                )}

                {error && (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <Button type="submit" disabled={loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
                  {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setError('');
                    }}
                    className="text-sm text-green-600 hover:text-green-700 hover:underline"
                  >
                    {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
