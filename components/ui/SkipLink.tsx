'use client';

import { useEffect, useState } from 'react';

export default function SkipLink() {
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        setIsFocused(true);
      }
    };

    const handleMouseDown = () => {
      setIsFocused(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  if (!isFocused) return null;

  return (
    <a
      href="#main-content"
      className="absolute top-0 left-0 z-50 bg-blue-600 text-white px-4 py-2 rounded-br-lg text-sm font-medium transform -translate-y-full focus:translate-y-0 transition-transform duration-200"
      onClick={(e) => {
        e.preventDefault();
        const target = document.getElementById('main-content');
        if (target) {
          target.focus();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }}
    >
      Skip to main content
    </a>
  );
}