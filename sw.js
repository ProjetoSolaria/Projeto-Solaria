importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const offlineFallbackPage = "paginas-html/offline.html";
const cacheName = "my-site-cache";
const filesToCache = [
  "/",
  "/paginas-html/sobre-o-projeto.html",
  "/paginas-html/como-funciona.html",
  "/paginas-html/inscricoes.html",
  "/fontes",
  "/estilos-css",
  "/código-js",
  "/imagens"
];

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
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const preloadResp = await event.preloadResponse;

          if (preloadResp) {
            return preloadResp;
          }

          const networkResp = await fetch(event.request);
          return networkResp;
        } catch (error) {
          const cache = await caches.open(cacheName);
          const cachedResp = await cache.match(offlineFallbackPage);
          return cachedResp;
        }
      })()
    );
  }
});

// Verificar atualizações do Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CHECK_FOR_UPDATES') {
    self.checkForUpdates();
  }
});

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.checkForUpdates = function () {
  fetch('/service-worker.js').then((response) => {
    response.text().then((text) => {
      if (text.includes('self.skipWaiting();')) {
        self.skipWaiting();
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: 'UPDATE_READY'
            });
          });
        });
      }
    });
  });
};

self.addEventListener('beforeinstallprompt', (event) => {
  // Exibe um popup de instalação
  event.userChoice.then((choiceResult) => {
    if (choiceResult.outcome === 'accepted') {
      console.log('Usuário aceitou a instalação do app.');
    } else {
      console.log('Usuário recusou a instalação do app.');
    }
  });
});

self.addEventListener('appinstalled', (event) => {
  console.log('O aplicativo foi instalado.', event);
});
