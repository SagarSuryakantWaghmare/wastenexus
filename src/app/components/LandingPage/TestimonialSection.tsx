import { Star, Quote } from "lucide-react";

const TestimonialCard = ({ testimonial, author, role, organization, rating, image }: {
  testimonial: string;
  author: string;
  role: string;
  organization: string;
  rating: number;
  image: string;
}) => {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative">
      {/* Quote Icon */}
      <div className="absolute top-4 right-4 text-green-200">
        <Quote className="w-8 h-8" />
      </div>

      {/* Rating */}
      <div className="flex space-x-1 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-5 h-5 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Testimonial */}
      <p className="text-gray-700 mb-6 leading-relaxed italic">
        &quot;{testimonial}&quot;
      </p>

      {/* Author Info */}
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {image}
        </div>
        <div>
          <h4 className="font-bold text-gray-900">{author}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
          <p className="text-gray-500 text-xs">{organization}</p>
        </div>
      </div>
    </div>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      testimonial: "WasteNexus has completely transformed our city's waste management. The AI route optimization has reduced our fuel costs by 40% and citizen satisfaction has increased dramatically.",
      author: "Dr. Priya Sharma",
      role: "Municipal Commissioner",
      organization: "Pune Municipal Corporation",
      rating: 5,
      image: "PS"
    },
    {
      testimonial: "As a waste collection supervisor, the real-time monitoring and blockchain transparency have made our operations so much more efficient. No more disputes about collection schedules!",
      author: "Rajesh Kumar",
      role: "Collection Supervisor",
      organization: "Delhi Waste Management",
      rating: 5,
      image: "RK"
    },
    {
      testimonial: "The citizen app is fantastic! I've earned over 500 green credits by properly segregating waste and reporting issues. My children love the educational games too.",
      author: "Meena Patel",
      role: "Citizen",
      organization: "Mumbai Resident",
      rating: 5,
      image: "MP"
    },
    {
      testimonial: "The analytics dashboard gives us unprecedented insights into waste generation patterns. We can now predict overflow situations and allocate resources more effectively.",
      author: "Amit Singh",
      role: "Data Analyst",
      organization: "Bengaluru Smart City",
      rating: 5,
      image: "AS"
    },
    {
      testimonial: "Our waste workers are happier and more efficient with the optimized routes. The safety checklists have also significantly reduced workplace incidents.",
      author: "Sarah Johnson",
      role: "Operations Manager",
      organization: "Chennai Corporation",
      rating: 5,
      image: "SJ"
    },
    {
      testimonial: "The blockchain audit trail has eliminated all disputes about collection schedules. Perfect transparency for government audits and citizen complaints.",
      author: "Dr. Vikram Rao",
      role: "Environmental Officer",
      organization: "Hyderabad GHMC",
      rating: 5,
      image: "VR"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-yellow-100 text-yellow-800 text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2" />
            Customer Success Stories
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">
              Leaders
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hear from municipal officials, waste workers, and citizens who have experienced 
            the transformative power of WasteNexus firsthand.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-8">Join Thousands of Satisfied Users</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-green-100">Cities Deployed</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-green-100">Active Citizens</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5000+</div>
              <div className="text-green-100">Waste Workers</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">4.9/5</div>
              <div className="text-green-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;