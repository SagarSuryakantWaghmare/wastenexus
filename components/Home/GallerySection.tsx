"use client";
import { useState, useEffect } from "react";
// use Next.js Image for public assets and ensure proper covering of the container
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { LoaderCircle } from "@/components/ui/loader";

type GalleryItem = {
  name: string;
  title: string;
  location: string;
  date: string;
  description: string;
  image: string;
};

export default function GallerySection () {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [current, setCurrent] = useState(0);
  const [noTransition, setNoTransition] = useState(false);

  // Mock gallery items (replace with real URLs / API later)
  useEffect(() => {
    const mock = [
      {
        name: 'Tree Plantation Drive',
        title: 'Student Plantation',
        location: 'Chhatrapati Sambhaji Nagar',
        date: 'Oct 10, 2025',
        description: `Deogiri students led a COSMO tree plantation, installing and mulching hundreds of saplings, preparing pits and scheduling watering. Volunteers received hands‑on planting and aftercare training, GPS locations were recorded for monitoring, and local residents committed to follow‑up stewardship to help saplings establish long‑term growth.`,
        image: '/assets/images/TreePlanation.jpg',
      },
      {
        name: 'Forest-side Collection',
        title: 'Forest Cleanup',
        location: 'Nearby Forest Area,Chhatrapati Sambhaji Nagar',
        date: 'Sep 18, 2025',
        description: `Volunteers cleared litter from forest edges and picnic spots, removing plastics, glass and hazardous debris while sorting recyclables. The effort improved habitat safety, reduced direct risks to wildlife, and produced hotspot data used to plan targeted prevention, signage and community awareness activities.`,
        image: '/assets/images/forest.jpg',
      },
      {
        name: 'Ploggers Sunday',
        title: 'Plogging Group',
        location: 'Mountain Trail, Chhatrapati Sambhaji Nagar',
        date: 'Aug 24, 2025',
        description: `Ploggers combined jogging with litter pickup on mountain trails, collecting wrappers, bottles and abandoned gear. The team logged waste types to identify recurring problems, improved trail safety and aesthetics, and strengthened community ties that encourage ongoing cleanups and broader participation.`,
        image: '/assets/images/Ploggers.jpg',
      },
    ];

    setItems(mock as GalleryItem[]);
  }, []);

  // Auto slide every 8 sec (8000ms) with proper wrap handling
  useEffect(() => {
    if (items.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => {
        if (prev === items.length - 1) {
          setNoTransition(true);
          // jump to start without animation
          setTimeout(() => setNoTransition(false), 50);
          return 0;
        }
        return prev + 1;
      });
    }, 8000);

    return () => clearInterval(timer);
  }, [items]);

  const nextSlide = () => {
    setCurrent((prev) => {
      if (prev === items.length - 1) {
        setNoTransition(true);
        setTimeout(() => setNoTransition(false), 50);
        return 0;
      }
      return prev + 1;
    });
  };

  const prevSlide = () => {
    setCurrent((prev) => {
      if (prev === 0) {
        setNoTransition(true);
        setTimeout(() => setNoTransition(false), 50);
        return items.length - 1;
      }
      return (prev - 1 + items.length) % items.length;
    });
  };

  if (items.length === 0)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <LoaderCircle size="xl" />
          <span className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">Loading Gallery...</span>
        </div>
      </div>
    );

  return (
    <section className="relative w-full max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">

      {/* Slider Row */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Our Work In Action
        </h2>
        <p className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Progress from community cleanups, recycling drives and champion events — real impact documented.
        </p>
      </div>

      <div className="overflow-hidden">
        <div
          className={`flex ${noTransition ? 'transition-none' : 'transition-transform duration-700 ease-in-out'}`}
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {items.map((item, index) => (
            <div key={index} className="min-w-full flex justify-center px-4">
              <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-stretch gap-6 border border-gray-100 dark:border-gray-700">

                {/* Large image column */}
                <div className="w-full md:w-2/3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0">
                  <div className="w-full h-96 md:h-full relative">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </div>

                {/* Details column */}
                <div className="w-full md:w-1/3 flex flex-col justify-center p-2 md:p-6">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">{item.name}</h3>
                  <span className="inline-block text-sm text-emerald-600 dark:text-emerald-300 font-medium mb-3">{item.title}</span>
                  <p className="text-gray-700 dark:text-gray-300 text-sm md:text-base mb-4">{item.description}</p>

                  <div className="flex flex-col gap-2 mt-auto text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      <span>{item.date}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">Photos from our recent community initiatives. Join a local event to contribute.</p>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev */}
      <button
        onClick={prevSlide}
        aria-label="Previous"
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-100" />
      </button>

      {/* Next */}
      <button
        onClick={nextSlide}
        aria-label="Next"
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-md hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-100" />
      </button>
    </section>
  );
}
