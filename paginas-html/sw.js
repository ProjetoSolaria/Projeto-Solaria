importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "pwabuilder-page";
const cacheName = "my-site-cache";
const filesToCache = [
  "/Projeto-Solaria/paginas-html/sobre-o-projeto.html",
  "/Projeto-Solaria/paginas-html/como-funciona.html",
  "/Projeto-Solaria/paginas-html/inscricoes.html",
  "/Projeto-Solaria/estilos-css/estilo-main.css",
  "/Projeto-Solaria/estilos-css/estilo-artigos.css",
  "/Projeto-Solaria/codigo-js/menu.js"
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

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cache = await caches.open(cacheName);
        const cachedResp = await cache.match(event.request);

        if (cachedResp) {
          return cachedResp;
        }

        const networkResp = await fetch(event.request);

        if (networkResp && networkResp.status === 200) {
          cache.put(event.request, networkResp.clone());
        }

        return networkResp;
      })()
    );
  }
});
