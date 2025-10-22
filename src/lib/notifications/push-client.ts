// Service Worker registration and push notification management
class PushNotificationClient {
  private subscription: PushSubscription | null = null;
  private isSupported: boolean = false;
  private registration: ServiceWorkerRegistration | null = null;

  constructor() {
    this.isSupported = 'serviceWorker' in navigator && 'PushManager' in window;
  }

  // Initialize the service worker and check for existing subscription
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Push notifications are not supported in this browser');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      // Check for existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();
      
      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  // Request permission and subscribe to push notifications
  async subscribe(): Promise<boolean> {
    if (!this.isSupported || !this.registration) {
      console.error('Push notifications not initialized');
      return false;
    }

    try {
      // Request permission
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn('Notification permission denied');
        return false;
      }

      // Subscribe to push notifications
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';
      if (!vapidKey) {
        throw new Error('VAPID public key is not configured');
      }
      
      const subscription = await this.registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: vapidKey
      });

      this.subscription = subscription;

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return true;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    }
  }

  // Unsubscribe from push notifications
  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) {
      console.warn('No active subscription to unsubscribe');
      return true;
    }

    try {
      // Unsubscribe locally
      const success = await this.subscription.unsubscribe();
      
      if (success) {
        // Remove subscription from server
        await this.removeSubscriptionFromServer(this.subscription);
        this.subscription = null;
      }

      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }

  // Check if user is subscribed
  isSubscribed(): boolean {
    return !!this.subscription;
  }

  // Get current subscription status
  async getSubscriptionStatus(): Promise<{
    isSupported: boolean;
    isSubscribed: boolean;
    permission: NotificationPermission;
  }> {
    return {
      isSupported: this.isSupported,
      isSubscribed: this.isSubscribed(),
      permission: typeof Notification !== 'undefined' ? Notification.permission : 'denied'
    };
  }

  // Send subscription to server
  private async sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionEndpoint: subscription.endpoint,
          keys: {
            p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')),
            auth: this.arrayBufferToBase64(subscription.getKey('auth'))
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending subscription to server:', error);
      throw error;
    }
  }

  // Remove subscription from server
  private async removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
    try {
      const response = await fetch('/api/notifications/register', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionEndpoint: subscription.endpoint
        })
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('Error removing subscription from server:', error);
      throw error;
    }
  }

  // Convert URL-safe base64 to Uint8Array
  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }

  // Convert ArrayBuffer to base64
  private arrayBufferToBase64(buffer: ArrayBuffer | null): string {
    if (!buffer) return '';
    
    const bytes = new Uint8Array(buffer);
    let binary = '';
    
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    
    return window.btoa(binary);
  }
}

// Create singleton instance
export const pushNotificationClient = new PushNotificationClient();

// Hook for using push notifications in React components
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const status = await pushNotificationClient.getSubscriptionStatus();
        setIsSupported(status.isSupported);
        setIsSubscribed(status.isSubscribed);
        setPermission(status.permission);
      } catch (error) {
        console.error('Error checking push notification status:', error);
      }
    };

    checkStatus();
  }, []);

  const subscribe = async (): Promise<boolean> => {
    if (!isSupported) return false;

    setLoading(true);
    try {
      const success = await pushNotificationClient.subscribe();
      if (success) {
        setIsSubscribed(true);
        setPermission('granted');
      }
      return success;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const unsubscribe = async (): Promise<boolean> => {
    if (!isSupported) return false;

    setLoading(true);
    try {
      const success = await pushNotificationClient.unsubscribe();
      if (success) {
        setIsSubscribed(false);
      }
      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    isSupported,
    isSubscribed,
    permission,
    loading,
    subscribe,
    unsubscribe
  };
}

// Import useState and useEffect for the hook
import { useState, useEffect } from 'react';