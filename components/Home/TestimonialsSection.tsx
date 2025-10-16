import { Star } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center text-green-700 mb-8">What Our Users Say</h2>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center">
          <Star className="h-8 w-8 text-yellow-500 mb-2" />
          <p className="text-gray-700 text-center italic mb-2">&quot;Waste Nexus made recycling fun and rewarding for my family!&quot;</p>
          <span className="text-green-700 font-semibold">- Priya, Client</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center">
          <Star className="h-8 w-8 text-yellow-500 mb-2" />
          <p className="text-gray-700 text-center italic mb-2">&quot;Organizing events is so easy, and I love seeing the impact!&quot;</p>
          <span className="text-green-700 font-semibold">- Rahul, Champion</span>
        </div>
        <div className="bg-green-50 rounded-xl shadow p-6 flex flex-col items-center">
          <Star className="h-8 w-8 text-yellow-500 mb-2" />
          <p className="text-gray-700 text-center italic mb-2">&quot;The leaderboard keeps me motivated to do more for my city.&quot;</p>
          <span className="text-green-700 font-semibold">- Ayesha, Client</span>
        </div>
      </div>
    </section>
  );
}
