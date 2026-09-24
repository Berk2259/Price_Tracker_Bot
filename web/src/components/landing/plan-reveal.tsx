"use client";

import { useEffect, useRef, useState } from "react";

// Bölüm ekrana girince "pl-in" sınıfını ekler, animasyonlar o zaman başlar.
export function PlanReveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={visible ? "pl-in" : ""}>
      {children}
    </div>
  );
}