'use client';

import { useEffect, useState } from 'react';

interface HCaptchaProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
  className?: string;
}

export default function HCaptcha({
  onVerify,
  onExpire,
  onError,
  className = ""
}: HCaptchaProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Charger hCaptcha
    const script = document.createElement('script');
    script.src = 'https://js.hcaptcha.com/1/api.js';
    script.async = true;
    script.defer = true;

    script.onload = () => {
      setIsLoaded(true);
      window.hCaptcha = {
        render: (container: string, config: any) => {
          const widgetId = (window as any).hcaptcha.render(container, config);
          return widgetId;
        },
        reset: (widgetId: string) => {
          (window as any).hcaptcha.reset(widgetId);
        },
        execute: (widgetId: string, options?: any) => {
          return (window as any).hcaptcha.execute(widgetId, options);
        }
      };
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  // Fonction globale pour le callback hCaptcha
  useEffect(() => {
    (window as any).hCaptchaOnVerify = (token: string) => {
      onVerify(token);
    };

    (window as any).hCaptchaOnExpire = () => {
      if (onExpire) onExpire();
    };

    (window as any).hCaptchaOnError = () => {
      if (onError) onError();
    };

    return () => {
      delete (window as any).hCaptchaOnVerify;
      delete (window as any).hCaptchaOnExpire;
      delete (window as any).hCaptchaOnError;
    };
  }, [onVerify, onExpire, onError]);

  useEffect(() => {
    if (isLoaded) {
      const container = document.getElementById('hcaptcha-container');
      if (container && window.hCaptcha) {
        // Nettoyer le conteneur
        container.innerHTML = '';

        // Rendre hCaptcha
        try {
          const widgetId = window.hCaptcha.render('hcaptcha-container', {
            sitekey: process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY!,
            theme: 'light',
            callback: 'hCaptchaOnVerify',
            'expired-callback': 'hCaptchaOnExpire',
            'error-callback': 'hCaptchaOnError'
          });
        } catch (error) {
          console.error('hCaptcha render error:', error);
          if (onError) onError();
        }
      }
    }
  }, [isLoaded, onError]);

  return (
    <div className={`flex justify-center ${className}`}>
      {!isLoaded && (
        <div className="w-full h-12 bg-muted rounded animate-pulse flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading verification...</span>
        </div>
      )}
      <div
        id="hcaptcha-container"
        className="w-full"
        style={{ minHeight: '72px' }}
      />
    </div>
  );
}

// Ajouter les types globaux pour TypeScript
declare global {
  interface Window {
    hCaptcha: {
      render: (container: string, config: any) => string;
      reset: (widgetId: string) => void;
      execute: (widgetId: string, options?: any) => Promise<string>;
    };
  }
}