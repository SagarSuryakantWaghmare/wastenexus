"use client";
import {
  useMotionValueEvent,
  useScroll,
  useTransform,
  motion,
} from "motion/react";
import React, { useEffect, useRef, useState } from "react";

interface TimelineEntry {
  title: string;
  content: React.ReactNode;
}

export const Timeline = ({ data }: { data: TimelineEntry[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 10%", "end 50%"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-gray-800 font-sans md:px-10"
      ref={containerRef}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 md:px-8 lg:px-10">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Platform Features by Role
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-base max-w-2xl">
          Explore the comprehensive features designed for each user role in our waste management ecosystem.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center border-2 border-emerald-500/30">
                <div className="h-3 w-3 rounded-full bg-emerald-500" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-xl mb-4 text-left font-bold text-emerald-600 dark:text-emerald-400">
                {item.title}
              </h3>
              {item.content}{" "}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-gradient-to-b from-emerald-500/20 via-emerald-500/40 to-emerald-500/20"
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-emerald-400 via-emerald-500 to-emerald-600"
          />
        </div>
      </div>
    </div>
  );
};
