'use client';

import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

interface AccessibleButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const AccessibleButton = forwardRef<HTMLButtonElement, AccessibleButtonProps>(
  ({
    children,
    className,
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    disabled,
    ...props
  }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "text-white hover:opacity-90 focus:ring-offset-2",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500",
      danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
      ghost: "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-500"
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

  const buttonStyle = variant === 'primary'
    ? { backgroundColor: BRAND_COLORS.primaryNavy, ...props.style }
    : props.style;

  return (
      <button
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        style={buttonStyle}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={loading ? 'loading-description' : undefined}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span id="loading-description" className="sr-only">
              Loading, please wait
            </span>
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="mr-2" aria-hidden="true">{leftIcon}</span>
            )}
            <span>{children}</span>
            {rightIcon && (
              <span className="ml-2" aria-hidden="true">{rightIcon}</span>
            )}
          </>
        )}
      </button>
    );
  }
);

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;