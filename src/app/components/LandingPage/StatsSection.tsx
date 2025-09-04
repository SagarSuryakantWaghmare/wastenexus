import StatsCounter from "./StatsCounter";

export default function StatsSection() {
  return (
    <section className="py-20 bg-gray-50">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">Our Impact</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          WastePulse is making waste management smarter and greener. Here are some of our key achievements.
        </p>
      </div>

      {/* Stats Counters */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <StatsCounter value={5000} label="Households Covered" />
        <StatsCounter value={120} label="Waste Workers Trained" />
        <StatsCounter value={25000} label="Kg of Waste Collected" />
      </div>
    </section>
  );
}
