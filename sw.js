importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "/Projeto-Solaria/paginas-html/offline.html";
const cacheName = "my-site-cache";

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener('install', async (event) => {
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        return cache.addAll(filesToCache);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Limpe caches antigos aqui
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name !== cacheName;
        }).map((name) => {
          return caches.delete(name);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      try {
        const networkResp = await fetch(event.request);

        if (networkResp && networkResp.status === 200) {
          // Se a solicitação foi bem-sucedida, atualize o cache com a resposta
          const cache = await caches.open(cacheName);
          cache.put(event.request, networkResp.clone());
        }

        return networkResp;
      } catch (error) {
        // Se houver um erro ao buscar na rede, tente buscar no cache
        const cache = await caches.open(cacheName);
        const cachedResp = await cache.match(event.request);

        if (cachedResp) {
          return cachedResp;
        }

        // Se a solicitação não estiver no cache, retorne a página offline
        if (event.request.mode === 'navigate') {
          return caches.match(offlineFallbackPage);
        }
      }
    })()
  );
});
