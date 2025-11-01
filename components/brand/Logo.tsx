'use client';

import React from 'react';

interface LogoProps {
  size?: number;
  variant?: 'symbol' | 'symbol-square' | 'wordmark' | 'full';
  className?: string;
  color?: 'navy' | 'silver' | 'white' | 'black';
}

export default function Logo({
  size = 48,
  variant = 'symbol',
  className = '',
  color = 'navy'
}: LogoProps) {
  const getColor = () => {
    switch (color) {
      case 'navy': return '#0A1A33';
      case 'silver': return '#E3E7EB';
      case 'white': return '#FFFFFF';
      case 'black': return '#000000';
      default: return '#0A1A33';
    }
  };

  const getBgColor = () => {
    if (variant === 'symbol-square') {
      return color === 'white' ? '#000000' : '#0A1A33';
    }
    return 'transparent';
  };

  const svgSize = variant === 'wordmark' ? size * 2.5 : size;
  const fillColor = variant === 'symbol-square' && color !== 'black' ? '#E3E7EB' : getColor();

  if (variant === 'wordmark') {
    return (
      <div className={`flex items-center ${className}`} style={{ width: `${svgSize}px`, height: `${size * 0.6}px` }}>
        <span
          style={{
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
            fontWeight: 600,
            fontSize: `${size * 0.5}px`,
            letterSpacing: '0.5px',
            color: fillColor,
            whiteSpace: 'nowrap'
          }}
        >
          StructureClerk
        </span>
      </div>
    );
  }

  if (variant === 'symbol-square') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width: `${size}px`, height: `${size}px` }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 300 300"
          xmlns="http://www.w3.org/2000/svg"
          style={{ borderRadius: `${size * 0.21}px` }}
        >
          <rect width="300" height="300" rx="64" fill={getBgColor()}/>
          <rect x="60" y="70" width="70" height="40" rx="6" fill={fillColor}/>
          <rect x="170" y="70" width="70" height="40" rx="6" fill={fillColor}/>
          <rect x="100" y="125" width="140" height="40" rx="6" fill={fillColor}/>
          <rect x="60" y="180" width="70" height="40" rx="6" fill={fillColor}/>
          <rect x="170" y="180" width="70" height="40" rx="6" fill={fillColor}/>
        </svg>
      </div>
    );
  }

  // Symbol variant (no container)
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width: `${size}px`, height: `${size * 0.87}px` }}>
      <svg
        width={size}
        height={size * 0.87}
        viewBox="0 0 300 260"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="60" y="0" width="70" height="40" rx="6" fill={fillColor}/>
        <rect x="170" y="0" width="70" height="40" rx="6" fill={fillColor}/>
        <rect x="100" y="55" width="140" height="40" rx="6" fill={fillColor}/>
        <rect x="60" y="110" width="70" height="40" rx="6" fill={fillColor}/>
        <rect x="170" y="110" width="70" height="40" rx="6" fill={fillColor}/>
      </svg>
    </div>
  );
}