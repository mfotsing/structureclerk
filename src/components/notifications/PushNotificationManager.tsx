'use client';

import { useState, useEffect } from 'react';
import { pushNotificationClient, usePushNotifications as usePushNotificationsClient } from '@/lib/notifications/push-client';
import { Bell, BellOff, CheckCircle, AlertCircle, X } from 'lucide-react';

interface PushNotificationManagerProps {
  className?: string;
}

export default function PushNotificationManager({ className = '' }: PushNotificationManagerProps) {
  const { isSupported, isSubscribed, permission, loading, subscribe, unsubscribe } = usePushNotificationsClient();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissedPrompt, setDismissedPrompt] = useState(false);

  // Check if we should show the prompt
  useEffect(() => {
    // Only show prompt if:
    // 1. Push notifications are supported
    // 2. User hasn't subscribed yet
    // 3. Permission is default (not asked yet)
    // 4. User hasn't dismissed the prompt
    // 5. Wait a bit after page load
    if (isSupported && !isSubscribed && permission === 'default' && !dismissedPrompt) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed, permission, dismissedPrompt]);

  // Initialize push notifications
  useEffect(() => {
    if (isSupported) {
      pushNotificationClient.initialize();
    }
  }, [isSupported]);

  const handleSubscribe = async () => {
    const success = await subscribe();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissedPrompt(true);
  };

  const handleUnsubscribe = async () => {
    const success = await unsubscribe();
    if (success) {
      // Optionally show a confirmation
      console.log('Unsubscribed from push notifications');
    }
  };

  // Don't render anything if push notifications are not supported
  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Notification Prompt */}
      {showPrompt && (
        <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-white rounded-lg shadow-lg border border-gray-200 p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-brand-orange/10 rounded-full flex items-center justify-center flex-shrink-0">
              <Bell className="w-5 h-5 text-brand-orange" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Activer les notifications
              </h3>
              <p className="text-xs text-gray-600 mb-3">
                Recevez des alertes en temps réel pour vos approbations, devis et mises à jour importantes.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="px-3 py-1.5 bg-brand-orange text-white text-xs font-medium rounded hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? 'Chargement...' : 'Activer'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-3 py-1.5 text-gray-600 text-xs font-medium rounded hover:bg-gray-100"
                >
                  Plus tard
                </button>
              </div>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Notification Status Indicator */}
      <div className={`flex items-center gap-2 ${className}`}>
        {isSubscribed ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Notifications activées</span>
            <button
              onClick={handleUnsubscribe}
              disabled={loading}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
              title="Désactiver les notifications"
            >
              Désactiver
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <BellOff className="w-4 h-4" />
            <span className="text-sm">Notifications désactivées</span>
            {permission === 'denied' ? (
              <span className="text-xs text-red-500" title="Vous avez bloqué les notifications. Modifiez les paramètres de votre navigateur pour les réactiver.">
                Bloquées
              </span>
            ) : (
              <button
                onClick={handleSubscribe}
                disabled={loading}
                className="text-xs text-brand-orange hover:text-orange-600 underline"
                title="Activer les notifications"
              >
                Activer
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Hook for sending push notifications from the client
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

// Component for notification settings in user profile
export function NotificationSettings() {
  const { isSupported, isSubscribed, permission, loading, subscribe, unsubscribe } = usePushNotificationsClient();

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <div>
            <h4 className="font-medium text-yellow-900">Notifications non supportées</h4>
            <p className="text-sm text-yellow-700">
              Votre navigateur ne supporte pas les notifications push. Essayez avec un navigateur moderne comme Chrome, Firefox ou Edge.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="font-medium text-gray-900">Notifications Push</h4>
          <p className="text-sm text-gray-600">
            Recevez des alertes en temps réel sur votre appareil
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isSubscribed ? 'bg-green-100' : 'bg-gray-100'
        }`}>
          {isSubscribed ? (
            <CheckCircle className="w-5 h-5 text-green-600" />
          ) : (
            <BellOff className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {permission === 'denied' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-red-700">
              Vous avez bloqué les notifications. Modifiez les paramètres de votre navigateur pour les réactiver.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">
            Statut: {isSubscribed ? 'Activées' : 'Désactivées'}
          </p>
          <p className="text-xs text-gray-500">
            Permission: {permission === 'granted' ? 'Accordée' : permission === 'denied' ? 'Refusée' : 'Non demandée'}
          </p>
        </div>
        
        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={loading}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            isSubscribed
              ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              : 'bg-brand-orange text-white hover:bg-orange-600'
          } disabled:opacity-50`}
        >
          {loading ? 'Chargement...' : isSubscribed ? 'Désactiver' : 'Activer'}
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <h5 className="text-sm font-medium text-gray-900 mb-2">Types de notifications</h5>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            Approbations en attente
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            Devis envoyés/acceptés
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            Factures en retard
          </li>
          <li className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-orange rounded-full"></div>
            Alertes de projet
          </li>
        </ul>
      </div>
    </div>
  );
}