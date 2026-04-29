'use client';
import { useEffect } from 'react';

export default function ScrollReveal() {
  useEffect(() => {
    const observe = () => {
      const els = document.querySelectorAll('.reveal:not(.visible)');
      const obs = new IntersectionObserver(
        (entries) =>
          entries.forEach((e) => {
            if (e.isIntersecting) e.target.classList.add('visible');
          }),
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
      );
      els.forEach((el) => obs.observe(el));
      return obs;
    };

    let obs = observe();

    const timer = setTimeout(() => {
      obs.disconnect();
      obs = observe();
    }, 1500);

    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
