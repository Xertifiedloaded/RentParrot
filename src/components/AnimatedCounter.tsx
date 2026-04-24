'use client';

import { useEffect, useRef, useState } from 'react';
import { Props } from '../types/index';

export default function AnimatedCounter({
  target,
  suffix = '+',
  duration = 1400,
  className = '',
}: Props) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          const frameMs = 16;
          const totalFrames = duration / frameMs;
          const increment = target / totalFrames;
          let current = 0;

          const timer = setInterval(() => {
            current = Math.min(current + increment, target);
            setValue(Math.floor(current));
            if (current >= target) clearInterval(timer);
          }, frameMs);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const display =
    target >= 1000
      ? `${(value / 1000).toFixed(value < target ? 1 : 0)}K`
      : value.toLocaleString();

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
