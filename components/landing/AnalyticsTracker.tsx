'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface AnalyticsEvent {
  event_name: string;
  event_params?: Record<string, any>;
  user_properties?: Record<string, any>;
}

class StructureClerkAnalytics {
  private readonly API_ENDPOINT = '/api/analytics/events';

  // Track page views
  trackPageView(pagePath: string, pageTitle?: string) {
    this.sendEvent({
      event_name: 'page_view',
      event_params: {
        page_path: pagePath,
        page_title: pageTitle || document.title,
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        referrer: document.referrer
      }
    });
  }

  // Track CTA clicks
  trackCTA(ctaName: string, location: string, variant?: string) {
    this.sendEvent({
      event_name: 'cta_click',
      event_params: {
        ctaName,
        location,
        variant,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      }
    });
  }

  // Track demo interactions
  trackDemoInteraction(action: string, step?: number, documentType?: string) {
    this.sendEvent({
      event_name: 'demo_interaction',
      event_params: {
        action,
        step,
        document_type: documentType,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      }
    });
  }

  // Track investor actions
  trackInvestorAction(action: string, data?: Record<string, any>) {
    this.sendEvent({
      event_name: 'investor_action',
      event_params: {
        action,
        ...data,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      }
    });
  }

  // Track scroll depth
  trackScrollDepth(depth: number) {
    this.sendEvent({
      event_name: 'scroll_depth',
      event_params: {
        depth_percentage: depth,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track time on page
  trackTimeOnPage(seconds: number, pagePath: string) {
    this.sendEvent({
      event_name: 'time_on_page',
      event_params: {
        seconds,
        page_path: pagePath,
        timestamp: new Date().toISOString()
      }
    });
  }

  // Track form submissions
  trackFormSubmission(formName: string, success: boolean, errors?: string[]) {
    this.sendEvent({
      event_name: 'form_submission',
      event_params: {
        form_name: formName,
        success,
        errors,
        timestamp: new Date().toISOString(),
        session_id: this.getSessionId()
      }
    });
  }

  // Private helper methods
  private sendEvent(event: AnalyticsEvent) {
    // Add common parameters
    const enrichedEvent = {
      ...event,
      user_properties: {
        ...event.user_properties,
        timestamp: event.event_params?.timestamp || new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        platform: navigator.platform,
        cookie_enabled: navigator.cookieEnabled
      }
    };

    // Send to backend API
    fetch(this.API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(enrichedEvent)
    }).catch(error => {
      console.warn('Analytics tracking failed:', error);
    });

    // Also send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      const gtag = (window as any).gtag;

      switch (event.event_name) {
        case 'page_view':
          gtag('config', 'GA_MEASUREMENT_ID', {
            page_path: event.event_params?.page_path,
            page_title: event.event_params?.page_title
          });
          break;
        case 'cta_click':
          gtag('event', 'cta_click', {
            cta_name: event.event_params?.cta_name,
            location: event.event_params?.location,
            variant: event.event_params?.variant
          });
          break;
        case 'demo_interaction':
          gtag('event', 'demo_interaction', {
            action: event.event_params?.action,
            step: event.event_params?.step,
            document_type: event.event_params?.document_type
          });
          break;
        case 'investor_action':
          gtag('event', 'investor_action', {
            action: event.event_params?.action,
            ...event.event_params
          });
          break;
        case 'scroll_depth':
          gtag('event', 'scroll_depth', {
            depth_percentage: event.event_params?.depth_percentage
          });
          break;
        case 'form_submission':
          gtag('event', 'form_submission', {
            form_name: event.event_params?.form_name,
            success: event.event_params?.success
          });
          break;
      }
    }

    // Send to Facebook Pixel if available
    if (typeof window !== 'undefined' && (window as any).fbq) {
      const fbq = (window as any).fbq;

      switch (event.event_name) {
        case 'page_view':
          fbq('track', 'PageView');
          break;
        case 'cta_click':
          if (event.event_params?.cta_name?.includes('investor')) {
            fbq('track', 'Lead');
          }
          break;
        case 'investor_action':
          if (event.event_params?.action === 'portal_access') {
            fbq('track', 'CompleteRegistration');
          }
          break;
      }
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sc_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('sc_session_id', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | null {
    return localStorage.getItem('sc_user_id') || null;
  }
}

// React Hook for analytics
export function useAnalytics() {
  const pathname = usePathname();
  const analytics = new StructureClerkAnalytics();

  useEffect(() => {
    // Track initial page view
    analytics.trackPageView(pathname, 'StructureClerk Investor Landing');

    // Track scroll depth
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const scrollPercentage = Math.round((currentScroll / scrollHeight) * 100);

      if (scrollPercentage > maxScrollDepth && scrollPercentage % 25 === 0) {
        maxScrollDepth = scrollPercentage;
        analytics.trackScrollDepth(scrollPercentage);
      }
    };

    window.addEventListener('scroll', handleScroll);

    // Track time on page
    const startTime = Date.now();
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.trackTimeOnPage(timeSpent, pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // Track final time on page when component unmounts
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      analytics.trackTimeOnPage(timeSpent, pathname);
    };
  }, [pathname, analytics]);

  return {
    trackCTA: (ctaName: string, location: string, variant?: string) =>
      analytics.trackCTA(ctaName, location, variant),

    trackDemoInteraction: (action: string, step?: number, documentType?: string) =>
      analytics.trackDemoInteraction(action, step, documentType),

    trackInvestorAction: (action: string, data?: Record<string, any>) =>
      analytics.trackInvestorAction(action, data),

    trackFormSubmission: (formName: string, success: boolean, errors?: string[]) =>
      analytics.trackFormSubmission(formName, success, errors),

    trackPageView: (pagePath: string, pageTitle?: string) =>
      analytics.trackPageView(pagePath, pageTitle)
  };
}

// Higher-order component for tracking
export function withAnalytics<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function WithAnalyticsComponent(props: T) {
    const analytics = useAnalytics();

    return <WrappedComponent {...props} analytics={analytics} />;
  };
}

// Individual tracking functions for easy use
export const trackEvent = {
  ctaClick: (ctaName: string, location: string, variant?: string) => {
    const analytics = new StructureClerkAnalytics();
    analytics.trackCTA(ctaName, location, variant);
  },

  demoInteraction: (action: string, step?: number, documentType?: string) => {
    const analytics = new StructureClerkAnalytics();
    analytics.trackDemoInteraction(action, step, documentType);
  },

  investorAction: (action: string, data?: Record<string, any>) => {
    const analytics = new StructureClerkAnalytics();
    analytics.trackInvestorAction(action, data);
  },

  formSubmission: (formName: string, success: boolean, errors?: string[]) => {
    const analytics = new StructureClerkAnalytics();
    analytics.trackFormSubmission(formName, success, errors);
  },

  pageView: (pagePath: string, pageTitle?: string) => {
    const analytics = new StructureClerkAnalytics();
    analytics.trackPageView(pagePath, pageTitle);
  }
};

export default StructureClerkAnalytics;