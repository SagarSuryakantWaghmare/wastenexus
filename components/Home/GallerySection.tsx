"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, MapPin, Calendar } from "lucide-react";
import { LoaderCircle } from "@/components/ui/loader";

type GalleryItem = {
  _id: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/gallery?limit=10');
        
        if (response.ok) {
          const data = await response.json();
          setItems(data.data);
        } else {
          throw new Error('Failed to fetch gallery items');
        }
      } catch (err) {
        console.error('Error fetching galleries:', err);
        setError('Failed to load gallery items');
          // No fallback data; rely on API-provided items
          setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchGalleries();
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
  }, [items.length]);

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

  if (loading || items.length === 0)
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="flex items-center gap-3">
          <LoaderCircle size="xl" />
          <span className="text-gray-600 dark:text-gray-400 font-medium animate-pulse">
            {loading ? 'Loading Gallery...' : 'No gallery items available'}
          </span>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="min-h-[300px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">{error}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Showing default content</p>
        </div>
      </div>
    );
  }

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
                <div className="w-full max-w-5xl bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6 flex flex-col md:flex-row items-stretch gap-6 border border-gray-100 dark:border-gray-700 min-h-0">

                {/* Large image column */}
                <div className="w-full md:w-2/3 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex-shrink-0 flex items-stretch min-h-0">
                  <div className="w-full aspect-[16/9] md:aspect-[4/3] md:h-full relative flex-1 min-h-0">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                </div>

                {/* Details column */}
                <div className="w-full md:w-1/3 flex flex-col justify-center p-2 md:p-6 min-h-0">
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
                      <span>{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
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
