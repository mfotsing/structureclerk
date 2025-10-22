import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ 
  end, 
  start = 0, 
  duration = 2000, 
  delay = 0, 
  prefix = '', 
  suffix = '',
  className = '',
  decimals = 0 
}) => {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);
  const startTimeRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      if (counterRef.current) {
        observer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      startTimeRef.current = Date.now();
      
      const animate = () => {
        const now = Date.now();
        const elapsed = now - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentCount = start + (end - start) * easeOutQuart;
        
        setCount(currentCount);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isVisible, start, end, duration, delay]);

  const displayCount = decimals > 0 ? count.toFixed(decimals) : Math.round(count);

  return (
    <span ref={counterRef} className={className}>
      {prefix}{displayCount}{suffix}
    </span>
  );
};

export default AnimatedCounter;