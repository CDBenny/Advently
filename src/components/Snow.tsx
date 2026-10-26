"use client";

import { useMemo } from "react";

export default function Snow({ count = 60 }: { count?: number }) {
  const flakes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: -Math.random() * 20,
        duration: 10 + Math.random() * 15,
        size: 3 + Math.random() * 5,
        opacity: 0.4 + Math.random() * 0.6,
      })),
    [count],
  );
  return (
    <div className="snow" aria-hidden>
      {flakes.map((f) => (
        <span
          key={f.id}
          style={{
            left: `${f.left}%`,
            animationDelay: `${f.delay}s`,
            animationDuration: `${f.duration}s`,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
          }}
        />
      ))}
    </div>
  );
}
