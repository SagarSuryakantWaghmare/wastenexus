import { Award, TrendingUp, Users } from "lucide-react";

export function FeaturesSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">Platform Features</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <Award className="h-10 w-10 text-green-600 mb-2" />
          <h3 className="font-semibold text-lg text-green-700 mb-2">Reward System</h3>
          <p className="text-gray-600 text-center">Earn points for every verified report and redeem for exciting rewards.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <TrendingUp className="h-10 w-10 text-green-600 mb-2" />
          <h3 className="font-semibold text-lg text-green-700 mb-2">Leaderboard</h3>
          <p className="text-gray-600 text-center">Track your progress and compete with others in your community.</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
          <Users className="h-10 w-10 text-green-600 mb-2" />
          <h3 className="font-semibold text-lg text-green-700 mb-2">Community Events</h3>
          <p className="text-gray-600 text-center">Participate in local cleanups, workshops, and awareness campaigns.</p>
        </div>
      </div>
    </section>
  );
}
