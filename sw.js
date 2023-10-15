importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const cacheName = 'my-site-cache';
const offlineFallbackPage = 'paginas-html/offline.html';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll([
        '/Projeto-Solaria/paginas-html/sobre-o-projeto.html',
        '/Projeto-Solaria/paginas-html/como-funciona.html',
        '/Projeto-Solaria/paginas-html/inscricoes.html',
        '/Projeto-Solaria/estilos-css/estilo-main.css',
        '/Projeto-Solaria/estilos-css/estilo-artigos.css',
        '/Projeto-Solaria/codigo-js/menu.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).then((fetchResponse) => {
        return caches.open(cacheName).then((cache) => {
          if (!fetchResponse || fetchResponse.status !== 200) {
            return cache.match(offlineFallbackPage);
          }
          cache.put(event.request, fetchResponse.clone());
          return fetchResponse;
        });
      }).catch(() => {
        return caches.match(offlineFallbackPage);
      });
    })
  );
});
