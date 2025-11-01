'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSignIn } from '@clerk/nextjs';
import Logo from '@/components/brand/Logo';
import { BRAND_COLORS } from '@/components/brand/BrandColors';

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { isLoaded, signIn, setActive } = useSignIn();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setIsLoading(true);
    setError('');

    try {
      // Attempt to sign in with Clerk
      const result = await signIn.create({
        identifier: formData.email,
        password: formData.password,
      });

      if (result.status === 'complete') {
        // Set the active session and redirect
        await setActive({ session: result.createdSessionId });
        router.push('/app');
      } else if (result.status === 'missing_requirements') {
        // Handle additional verification requirements
        setError('Additional verification required. Please check your email.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('Sign in error:', err);
      if (err.errors && err.errors.length > 0) {
        setError(err.errors[0].message);
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/" className="flex items-center">
            <Logo
              size={40}
              variant="symbol"
              color="navy"
              className="mr-3"
            />
            <Logo
              size={40}
              variant="wordmark"
              color="navy"
            />
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white py-8 px-4 shadow-sm sm:rounded-lg sm:px-10"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Welcome back! Please sign in to continue.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    '--tw-ring-color': BRAND_COLORS.primaryNavy
                  } as React.CSSProperties}
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 block w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent"
                  style={{
                    '--tw-ring-color': BRAND_COLORS.primaryNavy
                  } as React.CSSProperties}
                  placeholder="••••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-lg font-medium text-white transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: BRAND_COLORS.primaryNavy }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  '--tw-ring-color': BRAND_COLORS.primaryNavy
                } as React.CSSProperties}
              >
                <span className="sr-only">Sign in with Google</span>
                Google
              </button>

              <button
                type="button"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
                style={{
                  '--tw-ring-color': BRAND_COLORS.primaryNavy
                } as React.CSSProperties}
              >
                <span className="sr-only">Sign in with Microsoft</span>
                Microsoft
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/en/sign-up" className="font-medium" style={{ color: BRAND_COLORS.primaryNavy }}>
              Sign up for free
            </Link>
          </p>
        </motion.div>

        <p className="mt-8 text-center text-xs text-gray-500">
          © 2025 StructureClerk. Built with ❤️ in Canada.
        </p>
      </div>
    </div>
  );
}