"use client";

import { useEffect, useState } from "react";

interface StatsCounterProps {
  value: number;      // Target value
  label: string;      // Description label
  duration?: number;  // Animation duration in milliseconds
}

export default function StatsCounter({ value, label, duration = 2000 }: StatsCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = value / (duration / 50); // Update every 50ms
    const interval = setInterval(() => {
      start += increment;
      if (start >= value) {
        start = value;
        clearInterval(interval);
      }
      setCount(Math.floor(start));
    }, 50);

    return () => clearInterval(interval);
  }, [value, duration]);

  return (
    <div className="text-center">
      <h3 className="text-4xl font-extrabold text-green-600">{count}</h3>
      <p className="mt-2 text-gray-700">{label}</p>
    </div>
  );
}
