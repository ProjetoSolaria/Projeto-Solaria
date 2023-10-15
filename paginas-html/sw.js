importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const cacheName = "my-site-cache";
const filesToCache = [
  "/Projeto-Solaria/paginas-html/sobre-o-projeto.html",
  "/Projeto-Solaria/paginas-html/como-funciona.html",
  "/Projeto-Solaria/paginas-html/inscricoes.html",
  "/Projeto-Solaria/estilos-css/estilo-main.css",
  "/Projeto-Solaria/estilos-css/estilo-artigos.css",
  "/Projeto-Solaria/codigo-js/menu.js"
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(cacheName).then((cache) => {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', (event) => {
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
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
