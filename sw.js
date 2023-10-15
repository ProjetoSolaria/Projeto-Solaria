// Nome do cache
const CACHE_NAME = 'my-site-cache';

// Lista de recursos a serem armazenados em cache
const urlsToCache = [
  "/Projeto-Solaria/paginas-html/sobre-o-projeto.html",
  "/Projeto-Solaria/paginas-html/como-funciona.html",
  "/Projeto-Solaria/paginas-html/inscricoes.html",
  "/Projeto-Solaria/estilos-css/estilo-main.css",
  "/Projeto-Solaria/estilos-css/estilo-artigos.css",
  "/Projeto-Solaria/codigo-js/menu.js"
];

// Página offline personalizada
const offlineFallbackPage = "/Projeto-Solaria/paginas-html/offline.html";

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta as solicitações e busca na cache, retornando a página offline se não encontrada
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retorna a resposta da cache, se encontrada
        if (response) {
          return response;
        }
        // Senão, busca a página offline personalizada
        return fetch(event.request)
          .catch(() => caches.match(offlineFallbackPage));
      })
  );
});
