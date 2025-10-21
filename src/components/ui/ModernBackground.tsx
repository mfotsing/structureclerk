'use client'

import { cn } from '@/lib/utils'

interface ModernBackgroundProps {
  children: React.ReactNode
  className?: string
  variant?: 'dashboard' | 'page' | 'auth'
}

export default function ModernBackground({ 
  children, 
  className, 
  variant = 'page' 
}: ModernBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden', className)}>
      {/* Base gradient layer */}
      <div 
        className={cn(
          'absolute inset-0',
          variant === 'dashboard' 
            ? 'bg-gradient-to-br from-blue-50 via-white to-gray-50'
            : variant === 'auth'
            ? 'bg-gradient-to-b from-blue-50 via-white to-orange-50'
            : 'bg-gradient-to-br from-blue-50 via-white to-gray-50'
        )}
      />
      
      {/* Abstract light effect layers with liquid animation */}
      <div className="absolute inset-0">
        {/* Large radial gradient - top left with liquid animation */}
        <div
          className="absolute top-0 left-0 w-[800px] h-[800px] rounded-full opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #DAE6F0 0%, transparent 70%)',
            animation: 'liquidFloat 20s ease-in-out infinite',
          }}
        />
        
        {/* Medium radial gradient - bottom right with liquid animation */}
        <div
          className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full opacity-35 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #19406C 0%, transparent 60%)',
            animation: 'liquidFloat 25s ease-in-out infinite reverse',
          }}
        />
        
        {/* Small accent gradient - center right with liquid animation */}
        <div
          className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full opacity-30 blur-2xl transform translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, #C5CAD2 0%, transparent 50%)',
            animation: 'liquidWave 15s ease-in-out infinite',
          }}
        />
        
        {/* Additional floating gradient for more liquid effect */}
        <div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, #223654 0%, transparent 60%)',
            animation: 'liquidFloat 30s ease-in-out infinite',
          }}
        />
        
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2319406C' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>
      
      {/* CSS for liquid animations */}
      <style jsx>{`
        @keyframes liquidFloat {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(30px, -50px) scale(1.05);
          }
          50% {
            transform: translate(-20px, 30px) scale(0.95);
          }
          75% {
            transform: translate(40px, 20px) scale(1.02);
          }
        }
        
        @keyframes liquidWave {
          0%, 100% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            border-radius: 50%;
          }
          33% {
            transform: translate(20px, -30px) scale(1.1) rotate(120deg);
            border-radius: 60% 40% 70% 30%;
          }
          66% {
            transform: translate(-30px, 20px) scale(0.9) rotate(240deg);
            border-radius: 30% 60% 40% 70%;
          }
        }
      `}</style>
      
      {/* Subtle animated gradient for dashboard variant */}
      {variant === 'dashboard' && (
        <div className="absolute inset-0 opacity-40">
          <div 
            className="absolute inset-0 animate-pulse"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, rgba(26, 64, 108, 0.05) 50%, transparent 100%)',
              animationDuration: '8s',
            }}
          />
        </div>
      )}
      
      {/* Content container with proper z-index */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Subtle border frame for professional look */}
      <div className="absolute inset-0 border border-blue-100/20 pointer-events-none" />
    </div>
  )
}