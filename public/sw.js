// Service Worker for handling push notifications and offline functionality

const CACHE_NAME = 'structureclerk-v1';
const OFFLINE_URL = '/offline';

// Install event - cache resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/offline',
          '/dashboard',
          '/manifest.json',
          '/logo-icon.svg',
          '/logo-dark.svg'
        ]);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
        
        // Return a generic response for other requests
        return new Response(
          JSON.stringify({ error: 'You are offline' }),
          { 
            status: 503, 
            statusText: 'Service Unavailable',
            headers: { 'Content-Type': 'application/json' }
          }
        );
      })
  );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
  let notificationData = {
    title: 'StructureClerk',
    body: 'Vous avez une nouvelle notification',
    icon: '/logo-icon.svg',
    badge: '/logo-icon.svg',
    tag: 'structureclerk-notification',
    data: {},
    actions: [
      {
        action: 'view',
        title: 'Voir'
      },
      {
        action: 'dismiss',
        title: 'Ignorer'
      }
    ]
  };

  // Parse notification data if provided
  if (event.data) {
    try {
      const data = event.data.json();
      notificationData = {
        ...notificationData,
        ...data
      };
    } catch (error) {
      console.error('Error parsing push notification data:', error);
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      data: notificationData.data,
      actions: notificationData.actions,
      requireInteraction: notificationData.requireInteraction || false,
      silent: notificationData.silent || false,
      vibrate: notificationData.vibrate || [200, 100, 200]
    })
  );
});

// Notification click event - handle user interaction with notifications
self.addEventListener('notificationclick', (event) => {
  const notification = event.notification;
  const action = event.action;
  const notificationData = notification.data || {};

  // Close the notification
  notification.close();

  // Handle different actions
  if (action === 'dismiss') {
    // Just close the notification
    return;
  }

  // Default action or 'view' - open the relevant page
  event.waitUntil(
    clients.matchAll().then((clientList) => {
      // Find a focused client or open a new one
      let client = null;
      
      for (const client of clientList) {
        if (client.url === self.location.origin && client.focus) {
          client.focus();
          return client;
        }
      }

      // If no focused client, open a new one
      if (clients.openWindow) {
        // Determine URL to open based on notification data
        let urlToOpen = '/dashboard';
        
        if (notificationData.url) {
          urlToOpen = notificationData.url;
        } else if (notificationData.type) {
          switch (notificationData.type) {
            case 'quote':
              urlToOpen = `/dashboard/quotes${notificationData.id ? `/${notificationData.id}` : ''}`;
              break;
            case 'invoice':
              urlToOpen = `/dashboard/invoices${notificationData.id ? `/${notificationData.id}` : ''}`;
              break;
            case 'approval':
              urlToOpen = `/dashboard/approvals`;
              break;
            case 'project':
              urlToOpen = `/dashboard/projects${notificationData.id ? `/${notificationData.id}` : ''}`;
              break;
            default:
              urlToOpen = '/dashboard';
          }
        }
        
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Background sync event - handle background data synchronization
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Perform background synchronization
async function doBackgroundSync() {
  try {
    // Get all pending actions from IndexedDB
    const pendingActions = await getPendingActions();
    
    // Process each pending action
    for (const action of pendingActions) {
      try {
        await processAction(action);
        await removePendingAction(action.id);
      } catch (error) {
        console.error('Error processing pending action:', error);
      }
    }
  } catch (error) {
    console.error('Error during background sync:', error);
  }
}

// Helper functions for IndexedDB operations (simplified)
async function getPendingActions() {
  // In a real implementation, this would interact with IndexedDB
  // For now, return an empty array
  return [];
}

async function removePendingAction(actionId) {
  // In a real implementation, this would remove the action from IndexedDB
  return Promise.resolve();
}

async function processAction(action) {
  // In a real implementation, this would process the action
  // For now, just log it
  console.log('Processing action:', action);
  return Promise.resolve();
}