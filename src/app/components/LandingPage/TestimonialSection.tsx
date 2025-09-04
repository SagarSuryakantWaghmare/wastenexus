import TestimonialCard from "./TestimonialCard";

export default function TestimonialSection() {
  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Citizen",
      image: "/images/user1.jpg",
      testimonial: "WastePulse helped me segregate my waste effectively and earn rewards!"
    },
    {
      name: "Priya Singh",
      role: "Waste Worker",
      image: "/images/user2.jpg",
      testimonial: "The route optimization makes my job faster and safer."
    },
    {
      name: "Amit Verma",
      role: "Municipality Official",
      image: "/images/user3.jpg",
      testimonial: "Real-time dashboards allow us to monitor waste efficiently."
    }
  ];

  return (
    <section className="py-20 bg-green-50">
      {/* Section Heading */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-900">What People Say</h2>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
          Hear from our users and partners who are making a difference with WastePulse.
        </p>
      </div>

      {/* Testimonials Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <TestimonialCard key={idx} {...t} />
        ))}
      </div>
    </section>
  );
}
