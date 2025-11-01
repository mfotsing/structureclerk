'use client';

import React from 'react';
import Logo from './Logo';
import { LOGO_SIZES } from './BrandColors';

export default function LogoTest() {
  const sizes = [
    { name: 'App Store', size: LOGO_SIZES.appStore },
    { name: 'Play Store', size: LOGO_SIZES.playStore },
    { name: 'Desktop', size: LOGO_SIZES.desktop },
    { name: 'Favicon', size: LOGO_SIZES.favicon },
    { name: 'UI Icon', size: LOGO_SIZES.ui },
    { name: 'Nav Bar', size: LOGO_SIZES.navBar },
  ];

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8" style={{ color: '#0A1A33' }}>
        StructureClerk Logo Scalability Test
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sizes.map(({ name, size }) => (
          <div key={name} className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">{name}</h3>
            <div className="flex items-center justify-center mb-4" style={{ minHeight: `${size + 40}px` }}>
              <Logo
                size={size}
                variant="symbol"
                color="navy"
              />
            </div>
            <p className="text-sm text-gray-600">Size: {size}px</p>
            <p className="text-xs text-gray-500 mt-2">
              {size <= 16 ? '✅ Micro-icon readable' :
               size <= 32 ? '✅ favicon clear' :
               size <= 48 ? '✅ UI icon sharp' :
               size <= 256 ? '✅ Desktop perfect' :
               '✅ App Store ready'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Color Variants</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { color: 'navy' as const, bg: 'bg-gray-100' },
            { color: 'silver' as const, bg: 'bg-gray-800' },
            { color: 'white' as const, bg: 'bg-gray-900' },
            { color: 'black' as const, bg: 'bg-white' },
          ].map(({ color, bg }) => (
            <div key={color} className={`${bg} p-4 rounded-lg text-center`}>
              <h3 className="text-sm font-medium mb-2 capitalize">{color}</h3>
              <div className="flex justify-center">
                <Logo
                  size={48}
                  variant="symbol"
                  color={color}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-12 bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-2xl font-bold mb-6">Logo Variants</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { variant: 'symbol' as const, name: 'Symbol' },
            { variant: 'symbol-square' as const, name: 'Symbol Square' },
            { variant: 'wordmark' as const, name: 'Wordmark' },
          ].map(({ variant, name }) => (
            <div key={variant} className="text-center p-4">
              <h3 className="text-sm font-medium mb-4">{name}</h3>
              <div className="flex justify-center">
                <Logo
                  size={variant === 'wordmark' ? 120 : 64}
                  variant={variant}
                  color="navy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}