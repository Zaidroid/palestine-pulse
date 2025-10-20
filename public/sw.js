/**
 * V3 Service Worker for Palestine Pulse Dashboard
 *
 * Provides offline functionality and caching for the V3 data infrastructure:
 * - Cache static assets (JS, CSS, images)
 * - Cache API responses for offline access
 * - Background sync for data updates
 * - Push notifications for real-time alerts
 */

const CACHE_NAME = 'palestine-pulse-v3';
const DATA_CACHE_NAME = 'palestine-pulse-data-v3';
const API_CACHE_NAME = 'palestine-pulse-api-v3';

// ============================================
// INSTALL EVENT - CACHE STATIC ASSETS
// ============================================

self.addEventListener('install', (event) => {
  console.log('V3 Service Worker installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('V3 Service Worker caching static assets...');
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          // Add other critical static assets
        ]);
      })
      .then(() => {
        console.log('V3 Service Worker static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('V3 Service Worker installation failed:', error);
      })
  );
});

// ============================================
// ACTIVATE EVENT - CLEANUP OLD CACHES
// ============================================

self.addEventListener('activate', (event) => {
  console.log('V3 Service Worker activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete old caches that don't match current version
            if (cacheName !== CACHE_NAME &&
                cacheName !== DATA_CACHE_NAME &&
                cacheName !== API_CACHE_NAME) {
              console.log('V3 Service Worker deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('V3 Service Worker activated successfully');
        return self.clients.claim();
      })
  );
});

// ============================================
// FETCH EVENT - SERVE FROM CACHE WITH NETWORK FALLBACK
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle different types of requests
  if (isStaticAsset(request)) {
    event.respondWith(handleStaticAssetRequest(request));
  } else if (isAPIRequest(request)) {
    event.respondWith(handleAPIRequest(request));
  } else if (isDataRequest(request)) {
    event.respondWith(handleDataRequest(request));
  } else {
    event.respondWith(
      fetch(request).catch(() => {
        // Fallback for other requests
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      })
    );
  }
});

// ============================================
// BACKGROUND SYNC FOR DATA UPDATES
// ============================================

self.addEventListener('sync', (event) => {
  console.log('V3 Service Worker background sync triggered:', event.tag);

  if (event.tag === 'data-consolidation') {
    event.waitUntil(syncDataConsolidation());
  } else if (event.tag === 'palestine-data-update') {
    event.waitUntil(syncPalestineDataUpdate());
  }
});

// ============================================
// PUSH NOTIFICATIONS FOR REAL-TIME ALERTS
// ============================================

self.addEventListener('push', (event) => {
  console.log('V3 Service Worker push notification received');

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('Error parsing push notification data:', e);
    }
  }

  const options = {
    body: notificationData.body || 'New data available',
    icon: '/icon-192x192.png',
    badge: '/badge-72x72.png',
    tag: notificationData.tag || 'data-update',
    data: notificationData.data || {},
    actions: [
      {
        action: 'view',
        title: 'View Dashboard',
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
      },
    ],
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'Palestine Pulse Update',
      options
    )
  );
});

// ============================================
// NOTIFICATION CLICK HANDLER
// ============================================

self.addEventListener('notificationclick', (event) => {
  console.log('V3 Service Worker notification clicked:', event.action);

  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// ============================================
// REQUEST HANDLING UTILITIES
// ============================================

function isStaticAsset(request) {
  return request.url.includes('.js') ||
         request.url.includes('.css') ||
         request.url.includes('.png') ||
         request.url.includes('.jpg') ||
         request.url.includes('.svg') ||
         request.url.includes('.woff') ||
         request.url.includes('.woff2');
}

function isAPIRequest(request) {
  return request.url.includes('/api/') ||
         request.url.includes('techforpalestine.org') ||
         request.url.includes('goodshepherdcollective.org') ||
         request.url.includes('humdata.org') ||
         request.url.includes('worldbank.org');
}

function isDataRequest(request) {
  return request.url.includes('/data/') ||
         request.url.includes('data-consolidation');
}

// ============================================
// STATIC ASSET REQUEST HANDLER
// ============================================

async function handleStaticAssetRequest(request) {
  try {
    // Try network first for fresh assets
    const networkResponse = await fetch(request);

    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('V3 Service Worker serving static asset from cache:', request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// ============================================
// API REQUEST HANDLER
// ============================================

async function handleAPIRequest(request) {
  try {
    // Try network first
    const networkResponse = await fetch(request);

    // Cache successful API responses
    if (networkResponse.ok) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('V3 Service Worker serving API response from cache:', request.url);

    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'This data is not available offline',
        offline: true,
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// ============================================
// DATA REQUEST HANDLER
// ============================================

async function handleDataRequest(request) {
  try {
    // Try network first for fresh data
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      const cache = await caches.open(DATA_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log('V3 Service Worker serving data from cache:', request.url);

    // Fallback to cache for data requests
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Add offline indicator to cached data
      const data = await cachedResponse.json();
      data.offline = true;
      data.offlineSince = new Date().toISOString();

      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw error;
  }
}

// ============================================
// BACKGROUND SYNC HANDLER
// ============================================

async function syncDataConsolidation() {
  try {
    console.log('V3 Service Worker performing background data sync...');

    // Trigger data consolidation when online
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        action: 'consolidate-data',
      });
    });

    console.log('V3 Service Worker background sync completed');
  } catch (error) {
    console.error('V3 Service Worker background sync failed:', error);
  }
}

// ============================================
// NEW PALESTINE DATA UPDATE SYNC HANDLER
// ============================================

async function syncPalestineDataUpdate() {
  try {
    console.log('V3 Service Worker performing Palestine data update sync...');

    // Trigger comprehensive data update for all Good Shepherd datasets
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'BACKGROUND_SYNC',
        action: 'update-palestine-data',
        datasets: [
          'child-prisoners',
          'jerusalem-westbank-violence',
          'jerusalem-westbank-casualties',
          'gaza-casualties',
          'gaza-destruction',
          'healthcare-attacks',
          'home-demolitions',
          'ngo-data',
          'political-prisoners'
        ]
      });
    });

    console.log('V3 Service Worker Palestine data update sync completed');
  } catch (error) {
    console.error('V3 Service Worker Palestine data update sync failed:', error);
  }
}

// ============================================
// MESSAGE HANDLER FOR COMMUNICATION WITH MAIN THREAD
// ============================================

self.addEventListener('message', (event) => {
  console.log('V3 Service Worker received message:', event.data);

  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'GET_CACHE_INFO') {
    event.waitUntil(getCacheInfo().then(info => {
      event.ports[0].postMessage(info);
    }));
  }
});

// ============================================
// CACHE INFORMATION UTILITY
// ============================================

async function getCacheInfo() {
  const cacheNames = await caches.keys();
  const cacheInfo = {};

  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const keys = await cache.keys();
    cacheInfo[name] = {
      size: keys.length,
      urls: keys.map(req => req.url),
    };
  }

  return cacheInfo;
}